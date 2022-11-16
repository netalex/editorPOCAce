import { Injectable } from '@angular/core';
import { fieldData, MessageSyntax, SetSyntax, SyntaxConf } from "../interfaces/SyntaxDTO";
import * as syntax from "../data/APP11_editor.json"


@Injectable({
  providedIn: 'root'
})
export class App11SyntaxHelperService {

  synt: SyntaxConf = syntax;


  constructor() { }

  getFields(
    messageName: string,
    setName: string,
    setParameters:
      string[],
    lineNumber: number
  ) {
    const fieldArray: fieldData[]=[];

    const message: MessageSyntax = this.synt.messages[messageName]; // syntaxConf.messages[mesagename]
    if (message == null)
      return null;
    const setLine: SetSyntax = this.findSet(message, setName);
    if (setLine == null)
      return null;
    // return setLine.fields; 
    let i = 0;
    setParameters.forEach((el) => {
      const fd = new fieldData(setLine.fields[i], el);
      this.checkSyntax(fd)
      fieldArray.push(fd);
      if (i < setParameters.length - 1) i++
    });
    return fieldArray;
  }

  findSet: any = (message: MessageSyntax, setName: string) => {

    for (let i = 0; i < message.sets.length; i++) {
      let s = message.sets[i];
      if (s.setId.startsWith('*')) {
        const sbName: string = s.setId.substring(1);
        const m: MessageSyntax = this.synt.subBlocks[sbName];
        const f: SetSyntax = this.findSet(m, setName);
        if (f != null)
          return f;
      } else if (s.setId === setName) { return s }
    }
    return null
  }


  checkSyntax(fld: fieldData): void {
    if(fld.fldSynt && fld.fldSynt.cardinality && fld.fldSynt.cardinality==="M" && fld.currValue==="-"){
      fld.error = "Mandatory field "+fld.fldSynt.name+" missing";
      return;    
    }else if(fld.fldSynt && fld.fldSynt.ctrls){
      let ok = true;
      for(var k=0;k<fld.fldSynt.ctrls.length;k++){
          let ctrl = fld.fldSynt.ctrls[k]
          if(ctrl.type=="shared"){
            ctrl = this.synt.commonFields[ctrl.value]
          }

          if(fld.currValue && ctrl.minLength>fld.currValue.length){
            fld.error = "Field "+fld.fldSynt.name+" too short: min length expected: "+ctrl.minLength;
            return;    
          } else  if(ctrl.maxLength>0 && fld.currValue && ctrl.maxLength<fld.currValue.length){
            fld.error = "Field "+fld.fldSynt.name+" too long: max length expected: "+ctrl.maxLength;
            return;    
          }
  
          if(fld.currValue){
            switch(ctrl.type){
              case "pattern":
                const re= new RegExp(ctrl.value);
                if(re.test(fld.currValue))
                  return;
                break;
              default:  //TODO others
                break;
            }
            fld.error="Field "+fld.fldSynt.name+" does not match any expected pattern";
          }
      }
    }
  }
  
  

}





