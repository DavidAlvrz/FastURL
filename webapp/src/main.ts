import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MainModule } from './app/main/main.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(MainModule)
  .catch(err => console.error(err));
