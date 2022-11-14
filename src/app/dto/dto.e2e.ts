/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.27.744 on 2022-11-10 15:54:45.

export interface CtrlSyntax {
    type: string;
    value: string;
    minLength: number;
    maxLength: number;
    note?: string;
}

export interface FieldSyntax {
    name: string;
    cardinality: string; //mandatory|optional
    repeatible?: boolean; //
    description?: string;
    ctrls: CtrlSyntax[];
}

export interface MessageSyntax {
    subBlock?: boolean;
    cardinality: string;
    name: string;
    description?: string;
    documentation?: string;
    sets: SetSyntax[];
}

export interface SetSyntax {
    setId: string;
    cardinality: string;
    repeatible?: boolean;
    name: string;
    example?: string;
    description?: string;
    documentation?: string;
    fields: FieldSyntax[];
}

export interface SyntaxConf {
    messages: { [index: string]: MessageSyntax };
    subBlocks: { [index: string]: MessageSyntax };
    commonFields: { [index: string]: CtrlSyntax };
}

export class fieldData {
    fldSynt: FieldSyntax;
    orgValue?: string;
    currValue?:string;
    error?: string;
    constructor(fldSynt: FieldSyntax, orgValue: string){
        this.fldSynt = fldSynt
        this.orgValue = orgValue
        this.currValue = orgValue
        this.error = undefined
    }
}