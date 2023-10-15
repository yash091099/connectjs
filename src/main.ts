import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  const scriptEl = window.document.createElement('script');
  scriptEl.src = 'assets/js/prodConfig.js';
  window.document.body.appendChild(scriptEl);
  if (window) {
    window.console.log = () => {};
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
