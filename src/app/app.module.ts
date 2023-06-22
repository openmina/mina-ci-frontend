import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { INTERCEPTOR_PROVIDER } from '@core/interceptor/loading.interceptor';
import { THEME_PROVIDER } from '@core/services/theme-switcher.service';
import { AppGlobalErrorhandler, GlobalErrorHandlerService } from '@core/services/global-error-handler.service';
import { metaReducers, reducers } from './app.setup';
import { EffectsModule } from '@ngrx/effects';
import { NgrxRouterStoreModule } from '@shared/router/ngrx-router.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CONFIG } from '@shared/constants/config';
import { HttpClientModule } from '@angular/common/http';
import { EagerSharedModule } from '@shared/eager-shared.module';
import { ErrorListComponent } from '@error-preview/error-list/error-list.component';
import { ErrorPreviewComponent } from '@error-preview/error-preview.component';
import { ToolbarComponent } from '@app/layout/toolbar/toolbar.component';
import { ICONS_PROVIDER } from '@core/services/icon-register.service';
import { SubmenuTabsComponent } from '@app/layout/submenu-tabs/submenu-tabs.component';
import { AppEffects } from './app.effects';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ErrorListComponent,
    ErrorPreviewComponent,
    SubmenuTabsComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
        strictStateSerializability: true,
      },
    }),
    EffectsModule.forRoot([AppEffects]),
    NgrxRouterStoreModule,
    !CONFIG.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    HttpClientModule,
    BrowserAnimationsModule,
    EagerSharedModule,
  ],
  providers: [
    INTERCEPTOR_PROVIDER,
    THEME_PROVIDER,
    ICONS_PROVIDER,
    { provide: ErrorHandler, useClass: AppGlobalErrorhandler, deps: [GlobalErrorHandlerService] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
