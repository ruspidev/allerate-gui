import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from './material.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ThemeModule } from '@theme/theme.module';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { TranslateLangService } from '@core/bootstrap/translate-lang.service';
import { appInitializerProviders } from '@core/initializers';

// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ThemeModule,
    ToastrModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxWebstorageModule.forRoot({
      prefix: 'allerate',
      separator: '-',
      caseSensitive: true,
    }),
  ],
  providers: [appInitializerProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
