
export {
  re, wrap, read, write, update, select, readonly,
  on, sync, cycle,
  shared, free, mock, clear,
  event, filter, map,
  key
};

declare const key: ".remini";

declare function re(...args: any[]): any;
declare function wrap(...args: any[]): any;
declare function read(...args: any[]): any;
declare function write(...args: any[]): any;
declare function update(...args: any[]): any;
declare function select(...args: any[]): any;
declare function readonly(...args: any[]): any;

declare function on(...args: any[]): any;
declare function sync(...args: any[]): any;
declare function cycle(...args: any[]): any;

declare function shared(...args: any[]): any;
declare function free(...args: any[]): any;
declare function mock(...args: any[]): any;
declare function clear(...args: any[]): any;

declare function event(...args: any[]): any;
declare function filter(...args: any[]): any;
declare function map(...args: any[]): any;
