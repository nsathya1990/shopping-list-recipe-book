import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { environment } from '../../environments/environment';

import { User } from './user.model';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // user = new BehaviorSubject<User>(null);
    private tokenExpirationNumber: any;

    constructor(private httpClient: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

    signup(email: string, password: string): Observable<AuthResponseData | string> {
        return this.httpClient
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
                email,
                password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap((resData: AuthResponseData) => {
                    this.handleAuthentication(
                        resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            );
    }

    login(email: string, password: string): Observable<AuthResponseData | string> {
        return this.httpClient
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
                + environment.firebaseAPIKey, {
                email,
                password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap((resData: AuthResponseData) => {
                    this.handleAuthentication(
                        resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }));
    }

    autoLogin(): void {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData')); // synchronous method
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
            // this.user.next(loadedUser);
            this.store.dispatch(new AuthActions.Login({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate)
            }));
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout(): void {
        // this.user.next(null);
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationNumber) {
            clearTimeout(this.tokenExpirationNumber);
        }
        this.tokenExpirationNumber = null;
    }

    autoLogout(expirationDuration: number): void {
        console.log(expirationDuration);
        this.tokenExpirationNumber = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
        // expiresIn - The number of seconds in which the ID token expires
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        // this.user.next(user);
        this.store.dispatch(new AuthActions.Login({ email, userId, token, expirationDate }));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse): Observable<string> {
        let errorMessage = 'An unknown error occurred';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
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
        return throwError(errorMessage);
    }

}
