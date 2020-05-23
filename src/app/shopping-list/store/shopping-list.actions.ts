import { Action } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';

export class AddIngredient implements Action {
    // 'readonly' annotation is a TS feature which tells TS that this must never be changed from outside
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]) { }
}

// Pure TS feature which tells the type of ShoppingListActions is either 'AddIngredient' or 'AddIngredients'
export type ShoppingListActions = AddIngredient | AddIngredients;
