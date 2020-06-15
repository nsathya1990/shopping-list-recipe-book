import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // user = new BehaviorSubject<User>(null);
    private tokenExpirationNumber: any;

    constructor(private store: Store<fromApp.AppState>) { }

    logout(): void {
        this.store.dispatch(new AuthActions.Logout());
        localStorage.removeItem('userData');
        if (this.tokenExpirationNumber) {
            clearTimeout(this.tokenExpirationNumber);
        }
        this.tokenExpirationNumber = null;
    }

    setLogoutTimer(expirationDuration: number): void {
        console.log(expirationDuration);
        this.tokenExpirationNumber = setTimeout(() => {
            // this.logout();
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }

    clearLogoutTomer(): void {
        if (this.tokenExpirationNumber) {
            this.setLogoutTimer(this.tokenExpirationNumber);
            this.tokenExpirationNumber = null;
        }
    }

}
