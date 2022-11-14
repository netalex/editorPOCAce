import { Injectable } from '@angular/core';
import { AppSettingsService } from './services/getSyntax'
import { MessageSyntax, SyntaxConf } from "./dto/dto.e2e";
import * as syntax from "./data/APP11_editor.json"

@Injectable({
  providedIn: 'root'
})
export class App11SyntaxHelperService {
  synt: SyntaxConf = syntax;

  

  getSynt() {
    return this.synt;
  }

  // getFields( messageName = synt.messages['subdanger']

  getFields(messageName:string, setName:string, setParameters:string[], lineNumber:number) {
    const message:MessageSyntax = this.synt.messages[messageName]; // syntaxConf.messages[mesagename]
    console.log(message);
  }


  getParamsAndCheckSyntax = (messageName:string, set:string, lineNumber:number)=> { 
    
  }

}
