import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
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

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private httpClient: HttpClient, private router: Router) { }
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
                    map(resData => {
                        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                        return new AuthActions.Login({
                            email: resData.email,
                            userId: resData.localId,
                            token: resData.idToken,
                            expirationDate
                        });
                    }),
                    catchError(errorRes => {
                        let errorMessage = 'An unknown error occurred';
                        if (!errorRes.error || !errorRes.error.error) {
                            // return throwError(errorMessage);
                            return of(new AuthActions.LoginFail(errorMessage));
                        }
                        // this scenario will fail for some error such as network failure, therefore we added the condition above
                        switch (errorRes.error.error.message) {
                            case 'EMAIL_EXISTS':
                                errorMessage = 'The email address is already in use by another account.';
                                break;
                            case 'EMAIL_NOT_FOUND':
                                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                                break;
                            case 'INVALID_PASSWORD':
                                errorMessage = 'The password is invalid or the user does not have a password.';
                                break;
                            case 'USER_DISABLED':
                                errorMessage = 'The user account has been disabled by an administrator.';
                                break;
                            case 'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.':
                                errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                                break;
                            default:
                                break;
                        }
                        return of(new AuthActions.LoginFail(errorMessage));
                    })
                );
        })
    );
    @Effect({
        dispatch: false
    })
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
            this.router.navigate(['/']);
        })
    );
}
