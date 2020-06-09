import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';

import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

import { AuthService, AuthResponseData } from './auth.service';

import * as fromApp from '../store/app.reducer';
import * as fromActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

    error: string = null;
    isLoading = false;
    isLoginMode = true;
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

    private closeSub: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private compponentFactoryResover: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>) { }

    ngOnInit() {
        this.store.select('auth').subscribe(authData => {
            this.isLoading = authData.loading;
            this.error = authData.authError;
            if (this.error) {
                this.showErrorAlert(this.error);
            }
        });
    }

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
            // authObs = this.authService.login(email, password);
            this.store.dispatch(new fromActions.LoginStart({ email, password }));
        } else {
            authObs = this.authService.signup(email, password);
        }
        /* authObs.subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage; // this is not needed in programmatically creating dynamic component approach
            this.showErrorAlert(errorMessage);
            this.isLoading = false;
        }); */
        form.reset();
    }

    onHandleError(): void {
        this.error = null;
    }

    ngOnDestroy(): void {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

    private showErrorAlert(errorMessage: string): void {
        const alertComponentFactory = this.compponentFactoryResover.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
        componentRef.instance.message = errorMessage;
        this.closeSub = componentRef.instance.closeModal.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

}
