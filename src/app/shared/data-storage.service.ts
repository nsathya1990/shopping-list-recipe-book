import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Recipe } from '../recipes/recipe.model';

import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

// Since we are injecting the HTTPClient service into this service, we add the @Injectable() decorator
@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private httpClient: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();
        this.httpClient.put('https://ng-shooping-list-recipe-book.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes(): Observable<Recipe[]> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                return this.httpClient.get<Recipe[]>('https://ng-shooping-list-recipe-book.firebaseio.com/recipes.json', {
                    params: new HttpParams().set('auth', user.token)
                });
            }),
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            }));
    }

}
