import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import { AppModule } from './app.module';

enableProdMode();

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);

import '../sass/app.scss';