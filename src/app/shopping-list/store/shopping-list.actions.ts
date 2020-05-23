import { Action } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';

export class AddIngredient implements Action {
    // 'readonly' annotation is a TS feature which tells TS that this must never be changed from outside
    readonly type = ADD_INGREDIENT;
    payload: Ingredient;
}
