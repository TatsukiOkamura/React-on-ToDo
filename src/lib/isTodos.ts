import { Todo } from "../types/Todo";
/* eslint-disable @typescript-eslint/no-explicit-any */
//上段で与えられた引数が Todo型かどうかを判定している
const isTodo = (arg: any): arg is Todo => {
    return (
        typeof arg === 'object' &&
        Object.keys(arg).length === 4 &&
        typeof arg.id === 'number' &&
        typeof arg.value === 'string' &&
        typeof arg.checked === 'boolean' &&
        typeof arg.removed === 'boolean'
    );
};


export const isTodos = (arg: any): arg is Todo[] => {
  return Array.isArray(arg) && arg.every(isTodo);
}