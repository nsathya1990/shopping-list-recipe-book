import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from './recipe.model';

import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from './store/recipe.actions';

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        private dataStorageService: DataStorageService,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
        private actions$: Actions) { }

    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {
        /* const recipes = this.recipeService.getRecipes();
        if (recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        } */
        this.store.dispatch(new RecipesActions.FetchRecipes());
        return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
        );
    }

}
