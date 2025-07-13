export interface User {
  name: any;
  age: any;
}

/**
 * @param {any} name
 * @returns {any}
 */
export function greet(name: any): any {
  return name.length;
}

export const a: any = 'hello';

export function fn(x: any, y: any): any {
  return true;
}

export function wrap(value: any): any {
  return value;
}

export class A {
  name: any;
  age: any;
  a(x: any): any {
    return true;
  }
}
export const data: any = { name: 'a', age: 10 };
export const aUser: any = data as any;
export declare const x: any;

export function test(a: any): any {
  return true;
}
export let ax: any;
const fna: any = (a: any): any => {
  return a;
};
export const { x: z, y }: any = { x: 10, y: 20 } as any;
export const { x: z, y }: any = { x: 10, y: 20 };
function fd({ x: y, z }: any, [a, b]: any): any {
  return true;
}
