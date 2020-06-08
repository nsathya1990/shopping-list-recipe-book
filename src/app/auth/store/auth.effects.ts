import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { Actions, ofType, Effect } from '@ngrx/effects';

import * as AuthActions from './auth.actions';

import { environment } from '../../../environments/environment';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

export class AuthEffects {
    constructor(private actions$: Actions, private httpClient: HttpClient) { }
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.httpClient
                .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
                    + environment.firebaseAPIKey, {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }).pipe(
                    catchError(error => of()),
                    map(resData => {
                        of();
                    })
                );
        })
    );
}
