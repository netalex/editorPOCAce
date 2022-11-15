

import * as ace from "ace-builds";
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { exampleMsg } from "./data/exampleMsg2"

import { App11SyntaxHelperServiceService as sytaxHelper } from "./services/app11-syntax-helper-service.service"
import { fieldData } from "./dto/dto.e2e";
import { ThisReceiver } from "@angular/compiler";



@Component({
  selector: 'app-root', template: `
    <div *ngFor="let el of fieldArray">
    	<pre>name: {{el.fldSynt.name}}  description: {{el.fldSynt.description}}  value: {{el.orgValue}}  error: {{el.error}}</pre>
    </div>
    <div class="app-ace-editor"      #editor style="width: 1500px;height: 1250px;"></div>`,
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

  fieldArray: fieldData[];

  lastSet: number;
  lastMarker: number;
  fieldMarkers = [] as number[];
  aceEd: ace.Ace.Editor;

  altSet = 1 as number;

  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');
    this.aceEd = ace.edit(this.editor.nativeElement);

    this.aceEd.session.setValue(exampleMsg);
    this.aceEd.resize()

    // const synt: SyntaxConf = syntax;
    // syntaxHelper.get
    this.aceEd.on("click", () => {
      this.singlerowHandler()
    })
    this.aceEd.on("change", () => {
      this.singlerowHandler()
    })
    // console.log('synt', synt, "getter", synt.commonFields)
    this.allRowsHandler()
  }

  // this one could be a service
  private singlerowHandler(): void {
    this.aceEd.session.removeMarker(this.lastSet)
    this.aceEd.session.removeMarker(this.lastMarker)
    this.fieldMarkers.forEach(m => {
      this.aceEd.session.removeMarker(m);
    });

    const currRow = this.aceEd.selection.getCursor().row
    const currCol = this.aceEd.selection.getCursor().column

    let annotations = [] as ace.Ace.Annotation[];

    this.rowHandler(currRow, currCol, annotations)

    if (annotations.length > 0)
      this.aceEd.session.setAnnotations(annotations);

    this.aceEd.clearSelection()
    this.aceEd.moveCursorTo(currRow, currCol);
  }

  private allRowsHandler() {
    this.aceEd.session.removeMarker(this.lastSet)
    this.aceEd.session.removeMarker(this.lastMarker)
    this.fieldMarkers.forEach(m => {
      this.aceEd.session.removeMarker(m);
    });
    let annotations = [] as ace.Ace.Annotation[];

    let app11=0;
    const allLines=this.aceEd.session.getDocument().getAllLines();
    let firstLine=0;
    let app1Start=0;
    for(let r=0; r<allLines.length; r++){
      if(app11==0){
        if("BT"===allLines[r]){
          let rn = new ace.Range(firstLine, 0, r, 100);
          this.aceEd.session.addMarker(rn, "styleClassAcp127", "fullLine", false);
          rn = new ace.Range(r, 0, r, 2);
          this.aceEd.session.addMarker(rn, "styleClassBT", "text", false);
        firstLine=r+1
          app11++;
          continue;
        }
      }else if(app11==1){
        if(allLines[r].startsWith("OPER/") || allLines[r].startsWith("EXER/") || allLines[r].startsWith("MSGID/")){
          const rn = new ace.Range(firstLine, 0, r, 100);
          this.aceEd.session.addMarker(rn, "styleClassProlog", "fullLine", false);
          firstLine=r+1
          app11++;
          app1Start=firstLine;
          this.rowHandler(r, 0, annotations)
          continue;
        }
      }else if(app11==2){
          if("BT"===allLines[r]){
            const rn = new ace.Range(r, 0, r, 2);
            this.aceEd.session.addMarker(rn, "styleClassBT", "text", false);
            firstLine=r+1
            app11++;
            break;
          }
          this.rowHandler(r, 0, annotations)
      }
    }
    {
      const rn = new ace.Range(firstLine, 0, allLines.length, 100);
      this.aceEd.session.addMarker(rn, "styleClassAcp127", "fullLine", false);
    }

    if(annotations.length>0)
      this.aceEd.session.setAnnotations(annotations);

    this.aceEd.clearSelection()
    this.aceEd.moveCursorTo(app1Start, 0); 
  }

  private rowHandler(currRow: number, currCol: number, annotations: ace.Ace.Annotation[]): void{
      let lineNumber = currRow;
      
      let text = this.aceEd.session.getLine(lineNumber)
      if(text.trim()===""){
        annotations.push({
            row: lineNumber,
            column: 0,
            text: "Empty line",
            type: "warning" // also warning and information
          })
        this.aceEd.gotoLine(currRow+1, currCol, false);
        return;
      }
      while(text.startsWith("/") || text.trim()===""){
        lineNumber--;
        text = this.aceEd.session.getLine(lineNumber)
      }

      this.aceEd.gotoLine(lineNumber+1, 0, false);
      const sr = this.aceEd.find('//',{
        backwards: false,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: false,
        preventScroll: true
      }) as ace.Ace.Range;

//      this.aceEd.findNext();
      
      if(sr.start.row>lineNumber){
          const setRng = new ace.Range(lineNumber, 0, sr.start.row, sr.start.column);
          this.lastSet=this.aceEd.session.addMarker(setRng, "styleClassSET"+this.altSet, "text", false);
          this.altSet=(this.altSet+1) % 2;
          text = this.aceEd.session.getTextRange(setRng)
          text = text.replace(/(\r\n|\n|\r)/gm, "");
      }
    
      const fieldsArr = this.splitter(text); // if fieldsArr.lenght<2 errore
      const setName = fieldsArr[0];
      let fields = fieldsArr
      fields.shift();
      // . ;
      // const pippo =this.syntaxHelper.getFields('SUBDANGER', 'MSGID', this.data as string[], 2);

      const setSyntax = this.syntaxHelper.getFields('SUBDANGER', setName, fields, lineNumber);
      const rng = new ace.Range(lineNumber, 0, lineNumber, setName.length)
      if(setSyntax){  
        this.lastMarker=this.aceEd.session.addMarker(rng, "styleClassOK", "text", false)
        //annotations.push({
        //   row: lineNumber,
        //   column: 0,
        //   text: "Well formed Set",
        //   type: "information" // also warning and information
        // });

        let line = setName + "/"

        for(var i=0;i<setSyntax.length;i++){
          const fld = setSyntax[i];
          fld.currValue = fields[i];
          if(fld.fldSynt && fld.fldSynt.cardinality && fld.fldSynt.cardinality==="M" && fld.currValue==="-"){
              annotations.push({
                row: lineNumber,
                column: line.length,
                text: "Mandatory field "+fld.fldSynt.name+" missed" ,
                type: "error" // also warning and information
              });
              const fr = new ace.Range(lineNumber, line.length, lineNumber, line.length+fld.currValue.length)
              const m=this.aceEd.session.addMarker(fr, "styleClassKO", "text", false)
              this.fieldMarkers.push(m)
        }else if(fld.fldSynt && fld.fldSynt.ctrls){
              let ok = true as boolean
              for(var k=0;k<fld.fldSynt.ctrls.length;k++){
                  const ctrl = fld.fldSynt.ctrls[k]
                  if(fld.currValue && ctrl.minLength>fld.currValue.length){
                    annotations.push({
                      row: lineNumber,
                      column: line.length,
                      text: "Field "+fld.fldSynt.name+" too short: min length expected: "+ctrl.minLength,
                      type: "error" // also warning and information
                    });
                    const fr = new ace.Range(lineNumber, line.length, lineNumber, line.length+fld.currValue.length)
                    const m=this.aceEd.session.addMarker(fr, "styleClassKO", "text", false)
                    this.fieldMarkers.push(m)
                    ok=false
                  } else  if(ctrl.maxLength>0 && fld.currValue && ctrl.maxLength<fld.currValue.length){
                    annotations.push({
                      row: lineNumber,
                      column: line.length,
                      text: "Field "+fld.fldSynt.name+" too long: max length expected: "+ctrl.maxLength,
                      type: "error" // also warning and information
                    });
                    const fr = new ace.Range(lineNumber, line.length, lineNumber, line.length+fld.currValue.length)
                    const m=this.aceEd.session.addMarker(fr, "styleClassKO", "text", false)
                    this.fieldMarkers.push(m)
                    ok=false
                  }
                  line = line + fld.currValue + "/"
              }

          }
        
        }
  
      }else{
        this.lastMarker=this.aceEd.session.addMarker(rng, "styleClassKO", "text", false)
        annotations.push({
           row: lineNumber,
           column: 0,
           text: "Unknown Set name",
           type: "error" // also warning and information
         });
      }


//      console.log(setSyntax && setSyntax);
//      this.fieldArray = setSyntax as fieldData[];

    }




 

  ngOnInit() { }

  splitter(lineString: string) {
    const fields = lineString.split('/')
    return fields;
  }
}