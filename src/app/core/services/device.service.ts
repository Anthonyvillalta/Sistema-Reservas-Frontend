import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, fromEventPattern } from 'rxjs';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private mobileBreakpoint = 768;
  private tabletBreakpoint = 1024;

  private isMobileSubject = new BehaviorSubject<boolean>(false);
  private isTabletSubject = new BehaviorSubject<boolean>(false);
  private isDesktopSubject = new BehaviorSubject<boolean>(true);
  private deviceTypeSubject = new BehaviorSubject<DeviceType>('desktop');

  isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();
  isTablet$: Observable<boolean> = this.isTabletSubject.asObservable();
  isDesktop$: Observable<boolean> = this.isDesktopSubject.asObservable();
  deviceType$: Observable<DeviceType> = this.deviceTypeSubject.asObservable();

  private mediaQueryList!: MediaQueryList;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQueryList = window.matchMedia(`(max-width: ${this.mobileBreakpoint}px)`);
      this.update(this.mediaQueryList);
      this.mediaQueryList.addEventListener('change', (e: MediaQueryListEvent) => this.update(e));
    }
  }

  private update(mql: MediaQueryList | MediaQueryListEvent): void {
    const width = window.innerWidth;
    const isMobile = width < this.mobileBreakpoint;
    const isTablet = width >= this.mobileBreakpoint && width < this.tabletBreakpoint;
    const isDesktop = width >= this.tabletBreakpoint;

    this.isMobileSubject.next(isMobile);
    this.isTabletSubject.next(isTablet);
    this.isDesktopSubject.next(isDesktop);

    if (isMobile) this.deviceTypeSubject.next('mobile');
    else if (isTablet) this.deviceTypeSubject.next('tablet');
    else this.deviceTypeSubject.next('desktop');
  }
}
