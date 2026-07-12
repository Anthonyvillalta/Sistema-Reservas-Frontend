import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};


export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);


  const token = authService.getToken();

  if (!token) {
    return router.createUrlTree(['/login']);
  }


  const user = authService.getCurrentUser();


  if (!user) {
    return router.createUrlTree(['/login']);
  }


  if (
    user.role === 'ADMIN' ||
    user.role === 'ASISTENTE'
  ) {
    return true;
  }


  return router.createUrlTree(['/m/home']);

};



export const mobileGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);


  if (!authService.getToken()) {
    return router.createUrlTree(['/m/login']);
  }


  return true;
};