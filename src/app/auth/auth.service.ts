import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    API_KEY = 'AIzaSyCVUJfJsjp-zNGDvCgEUhZ3vDoiOPPNdvE';

    constructor(private httpClient: HttpClient) { }

    signup(email: string, password: string): Observable<AuthResponseData> {
        return this.httpClient
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[' + this.API_KEY + ']', {
                email,
                password,
                returnSecureToken: true
            });
    }

}
