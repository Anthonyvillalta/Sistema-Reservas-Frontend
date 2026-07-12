import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { 
  provideRouter,
  withHashLocation,
  withNavigationErrorHandler,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import { retryImport } from './shared/utils/retry-import';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';


export const appConfig: ApplicationConfig = {

 providers:[

  provideRouter(
    routes,
    withHashLocation(),
    withPreloading(PreloadAllModules),
    withNavigationErrorHandler((error)=>{

      console.error(
        'Error cargando módulo:',
        error
      );

      const errMsg = (error as any)?.message ?? (error as any)?.error?.message ?? '';

      if(
        typeof errMsg === 'string' &&
        errMsg.includes('Failed to fetch dynamically imported module')
      ){
        window.location.reload();
      }

    })

  ),


  provideHttpClient(
    withInterceptors([
      jwtInterceptor
    ])
  ),


  provideAnimations(),

  {
    provide:LOCALE_ID,
    useValue:'es-PE'
  },


  {
    provide:MAT_DATE_LOCALE,
    useValue:'es-PE'
  },


  {
    provide:MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue:{
      appearance:'outline',
      floatLabel:'always'
    }
  }

 ]

};