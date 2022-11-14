import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { App11SyntaxHelperServiceService } from './services/app11-syntax-helper-service.service';
import {AppSettingsService} from './services/getSyntax'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [AppSettingsService, App11SyntaxHelperServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
