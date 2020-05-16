import { Component, ComponentFactoryResolver } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AlertComponent } from '../shared/alert/alert.component';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    error: string = null;
    isLoading = false;
    isLoginMode = true;

    constructor(
        private authService: AuthService, private router: Router, private compponentFactoryResover: ComponentFactoryResolver) { }

    onSwitchMode(): void {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData | string>;
        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage; // this is not needed in programmatically creating dynamic component approach
            this.showErrorAlert(errorMessage);
            this.isLoading = false;
        });
        form.reset();
    }

    onHandleError(): void {
        this.error = null;
    }

    private showErrorAlert(errorMessage: string): void {
        const alertComponentFactory = this.compponentFactoryResover.resolveComponentFactory(AlertComponent);

    }

}
