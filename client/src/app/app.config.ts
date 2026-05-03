import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth.interceptor';

function initializeApiUrl() {
  return async () => {
    // Load API URL from config file (for Netlify static deployment)
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/api-config.json');
        const config = await response.json();
        (window as any).API_URL = config.apiUrl;
      } catch (error) {
        console.error('Failed to load API config:', error);
      }
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: APP_INITIALIZER, useFactory: initializeApiUrl, multi: true }
  ]
};
