interface INumberList {
    [index:number]: number;
    length:         number;
    push(...args: any[]);
    pop(): any;
    forEach(...args: any[]);
    indexOf(number): number;
}

interface INumberNumberList {
    [index:number]: INumberList;
    length:         number;
    push(...args: any[]);
    pop(): INumberList;
    forEach(...args: any[]);
}

interface IAnyList {
    [index:number]: any;
    length:         number;
    push(...args: any[]);
    forEach(...args: any[]);
}

interface INumberHashMap {
    [index:string]: number;
}
