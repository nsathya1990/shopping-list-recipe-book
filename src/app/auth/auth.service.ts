import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';

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

    API_KEY = 'AIzaSyCVUJfJsjp-zNGDvCgEUhZ3vDoiOPPNdvE';
    user = new Subject<User>();

    constructor(private httpClient: HttpClient) { }

    signup(email: string, password: string): Observable<AuthResponseData | string> {
        return this.httpClient
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.API_KEY, {
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
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.API_KEY, {
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

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        // expiresIn - The number of seconds in which the ID token expires
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
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
