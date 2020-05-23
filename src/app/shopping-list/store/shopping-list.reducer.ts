import { Ingredient } from '../../shared/ingredient.model';

import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
};

// This function will be called by NgRx by passing two arguments
// 'state' is the current state before it was changed. It is changed by the Reducer
// 'action' is the action that triggers the Reducer and the state update
export function ShoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) {
    switch (action.type) {
        // The conevention is to use all uppercase text
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
    }
}
