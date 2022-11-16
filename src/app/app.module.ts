import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { App11SyntaxHelperService } from './services/app11-syntax-helper-service';
import {AppSettingsService} from './services/getSyntax';
import { App11EditorComponent } from './components/app11-editor/app11-editor.component'

@NgModule({
  declarations: [
    AppComponent,
    App11EditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [AppSettingsService, App11SyntaxHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
