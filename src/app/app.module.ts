import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { INTERCEPTOR_PROVIDER } from '@core/interceptor/loading.interceptor';
import { THEME_PROVIDER } from '@core/services/theme-switcher.service';
import { AppGlobalErrorhandler, GlobalErrorHandlerService } from '@core/services/global-error-handler.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [
    INTERCEPTOR_PROVIDER,
    THEME_PROVIDER,
    { provide: ErrorHandler, useClass: AppGlobalErrorhandler, deps: [GlobalErrorHandlerService] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
