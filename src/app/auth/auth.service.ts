import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    constructor(private httpClient: HttpClient) { }

    signup(email: string, password: string): Observable<AuthResponseData> {
        return this.httpClient
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.API_KEY, {
                email,
                password,
                returnSecureToken: true
            }).pipe(catchError(errorRes => {
                let errorMessage = 'An unknown error occurred';
                if (!errorRes.error || !errorRes.error.error) {
                    return throwError(errorMessage);
                }
                // this scenario will fail for some error such as network failure, therefore we added the condition above
                switch (errorRes.error.error.message) {
                    case 'EMAIL_EXISTS':
                        errorMessage = 'The email address is already in use by another account.';
                        break;
                    case 'OPERATION_NOT_ALLOWED':
                        errorMessage = 'Password sign-in is disabled for this project';
                        break;
                    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                        break;
                    default:
                        break;
                }
                return throwError(errorMessage);
            }));
    }

    login(email: string, password: string): Observable<AuthResponseData> {
        return this.httpClient
        .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.API_KEY, {
            email,
            password,
            returnSecureToken: true
        });
    }

}
