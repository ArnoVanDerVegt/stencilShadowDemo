interface INumberList {
    [index:number]: number;
    length:         number;
    push(...args: any[]);
    pop(): any;
}

interface INumberNumberList {
    [index:number]: INumberList;
    length:         number;
    push(...args: any[]);
    pop(): INumberList;
}

interface IAnyList {
    [index:number]: any;
    length:         number;
    push(...args: any[]);
}

interface INumberHashMap {
    [index:string]: number;
}
