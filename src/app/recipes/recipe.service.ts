import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();
    /* private recipes: Recipe[] = [
        new Recipe(
            'Big Fat Burger',
            'What else you need to say?',
            'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]),
        new Recipe(
            'Tasty Schnitzel',
            'Meat is animal flesh that is eaten as food',
            'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1)
            ]),
        new Recipe(
            'Spaghetti',
            'Spaghetti is a long, thin, cylindrical pasta',
            'https://upload.wikimedia.org/wikipedia/commons/2/2a/Spaghetti_al_Pomodoro.JPG',
            [
                new Ingredient('Spaghetti', 100),
                new Ingredient('Tomato', 2)
            ])
    ]; */
    private recipes: Recipe[] = [];

    constructor(private shoppingListService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]): void {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    /**
     * The slice() method will return a new array which is an exact copy of this array.
     * Therefore, we don't get a reference of this array; we just get a copy.
     */
    getRecipes(): Recipe[] {
        return this.recipes.slice();
    }

    getRecipe(index: number): Recipe {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]): void {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe): void {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe): void {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number): void {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

}
