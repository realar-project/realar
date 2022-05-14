
export {
  re, wrap, read, write, update, select, readonly,
  on, once, sync, cycle,
  shared, free, mock, unmock, clear,
  event, fire, filter, map,
  unsubs, un,
  batch, untrack,
  observe, useRe, useLogic, useJsx, useWrite,
  key_remini
};

declare const key_remini: '.remini';

declare function re(...args: any[]): any;
declare function wrap(...args: any[]): any;
declare function read(...args: any[]): any;
declare function write(...args: any[]): any;
declare function update(...args: any[]): any;
declare function select(...args: any[]): any;
declare function readonly(...args: any[]): any;

declare function on(...args: any[]): any;
declare function once(...args: any[]): any;
declare function sync(...args: any[]): any;
declare function cycle(...args: any[]): any;

declare function shared(...args: any[]): any;
declare function free(...args: any[]): any;
declare function mock(...args: any[]): any;
declare function unmock(...args: any[]): any;
declare function clear(...args: any[]): any;

declare function event(...args: any[]): any;
declare function fire(...args: any[]): any;
declare function filter(...args: any[]): any;
declare function map(...args: any[]): any;

declare function unsubs(...args: any[]): any;
declare function un(...args: any[]): any;

declare function batch(...args: any[]): any;
declare function untrack(...args: any[]): any;

declare const observe: any;

declare function useRe(...args: any[]): any;
declare function useLogic(...args: any[]): any;
declare function useJsx(...args: any[]): any;
declare function useWrite(...args: any[]): any;
