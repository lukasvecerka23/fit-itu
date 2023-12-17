import { writable } from "svelte/store";

export const showShoppingList = writable(false);
export const reloadPantry = writable(false);
export const reloadShoppingList = writable(false);