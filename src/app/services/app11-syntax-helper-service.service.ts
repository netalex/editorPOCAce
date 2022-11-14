import { Injectable } from '@angular/core';
import { fieldData, MessageSyntax, SetSyntax, SyntaxConf } from "../dto/dto.e2e";
import * as syntax from "../data/APP11_editor.json"


@Injectable({
  providedIn: 'root'
})
export class App11SyntaxHelperServiceService {

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
      checkSyntax(fd)
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

}






function checkSyntax(fd: fieldData) {
  //todo: throw new Error('Function not implemented.');
}

