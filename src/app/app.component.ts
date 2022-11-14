

import * as ace from "ace-builds";
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { exampleMsg } from "./data/exampleMsg2"

import { App11SyntaxHelperServiceService as sytaxHelper } from "./services/app11-syntax-helper-service.service"
import { fieldData } from "./dto/dto.e2e";



@Component({
  selector: 'app-root', template: `
    <div *ngFor="let el of fieldArray">
    	<pre>name: {{el.fldSynt.name}}  description: {{el.fldSynt.description}}  value: {{el.orgValue}}  error: {{el.error}}</pre>
    </div>
    <div class="app-ace-editor"      #editor style="width: 500px;height: 1250px;"></div>`,
  styles: [
    `
    .app-ace-editor: {
        border: 2px solid #f8f9fa;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }`
  ],
})
export class AppComponent implements AfterViewInit {

  constructor(private syntaxHelper: sytaxHelper) { }

  @ViewChild("editor") private editor: ElementRef<HTMLElement>;

  data = ["APP-11(D)", "1", "LIVE WELLS", "999", "20150630T103030Z", "UPD", "1", "GBR", "OTH:PROTECT", null, "MEDICAL"]
  textline: string;

  fieldArray: fieldData[];

  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');
    const aceEd = ace.edit(this.editor.nativeElement);
    aceEd.session.setValue(exampleMsg); aceEd.resize()

    // const synt: SyntaxConf = syntax;
    // syntaxHelper.get
    aceEd.on("click", () => {
      const lineNumber = aceEd.getSelectionRange().start.row;
      const text = aceEd.session.getLine(lineNumber)
      this.textline = text;
      const fieldsArr = this.splitter(this.textline); // if fieldsArr.lenght<2 errore
      const setName = fieldsArr[0];
      let fields = fieldsArr
      fields.shift();
      // . ;
      // const pippo =this.syntaxHelper.getFields('SUBDANGER', 'MSGID', this.data as string[], 2);
      const pippo = this.syntaxHelper.getFields('SUBDANGER', setName, fields, lineNumber);
      console.log(pippo && pippo);
      this.fieldArray = pippo as fieldData[];

    })




    // console.log('synt', synt, "getter", synt.commonFields)
  }

  ngOnInit() { }

  splitter(lineString: string) {
    const fields = lineString.split('/')
    return fields;
  }
}