export interface User {
  name: string;
  age: number;
}

/**
 * @param {string} name
 * @returns {number}
 */
export function greet(name: string): number {
  return name.length;
}

export const a: string = 'hello';

export function fn(x: number, y: string): boolean {
  return true;
}

export function wrap<T>(value: T): T {
  return value;
}

export class A {
  name: string;
  age: number;
  a(x: string): boolean {
    return true;
  }
}
export const data = { name: 'a', age: 10 };
export const aUser: User = data as User;
export declare const x: string;

export function test(a) {
  return true;
}
export let ax;
const fna = (a) => {
  return a;
};
