import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { Recipe } from '../recipe.model';

import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {
    constructor(private actions$: Actions, private httpClient: HttpClient) { }
    // when 'RecipesActions.FETCH_RECIPES' occurs, we want to kick off the effect here
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.httpClient.get<Recipe[]>('https://ng-shooping-list-recipe-book.firebaseio.com/recipes.json')
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );
}
