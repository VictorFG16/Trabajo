import { bootstrapApplication } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {

  providers: [

    ...appConfig.providers,

    provideCharts(withDefaultRegisterables())

  ]

}).catch((err) => console.error(err))

;
