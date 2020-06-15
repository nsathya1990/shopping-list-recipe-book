import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Recipe } from '../recipes/recipe.model';

import { RecipeService } from '../recipes/recipe.service';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

// Since we are injecting the HTTPClient service into this service, we add the @Injectable() decorator
@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private httpClient: HttpClient, private recipeService: RecipeService, private store: Store<fromApp.AppState>) { }

    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();
        this.httpClient.put('https://ng-shooping-list-recipe-book.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes(): Observable<Recipe[]> {
        return this.httpClient.get<Recipe[]>('https://ng-shooping-list-recipe-book.firebaseio.com/recipes.json')
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap(recipes => {
                    // this.recipeService.setRecipes(recipes);
                    this.store.dispatch(new RecipesActions.SetRecipes(recipes));
                })
            );
    }

}
