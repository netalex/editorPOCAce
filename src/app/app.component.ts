
import { Component } from '@angular/core';

import { exampleMsg } from "./data/exampleMsg2"



@Component({
  selector: 'app-root', template: `
    <app-app11-editor [message]="m" [view]="false"></app-app11-editor>`,
  styles: [
  ],
})
export class AppComponent {
  m=exampleMsg;

  constructor() { 

  }



}