import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {

    private recipes: Recipe[] = [
        new Recipe('Meat', 'Meat is animal flesh that is eaten as food',
            'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'),
        new Recipe('Hot Dog', 'Meat is animal flesh that is eaten as food',
            'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg')
    ];
    recipeSelected = new EventEmitter<Recipe>();

    /**
     * The slice() method will return a new array which is an exact copy of this array.
     * Therefore, we don't get a reference of this array; we just get a copy.
     */
    getRecipes() {
        return this.recipes.slice();
    }

}
