import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';

import { RecipeService } from '../recipes/recipe.service';

// Since we are injecting the HTTPClient service into this service, we add the @Injectable() decorator
@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private httpClient: HttpClient, private recipeService: RecipeService) { }

    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();
        this.httpClient.put('https://ng-shooping-list-recipe-book.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes(): void {
        this.httpClient.get<Recipe[]>('https://ng-shooping-list-recipe-book.firebaseio.com/recipes.json')
            .pipe(map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }))
            .subscribe(recipes => {
                this.recipeService.setRecipes(recipes);
            });
    }

}
