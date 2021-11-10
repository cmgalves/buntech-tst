import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    userMail: any[]; // Save logged in user data
    userData: any; // Save logged in user data
    arrUsuario: any = [];
    constructor(
        public router: Router,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
    ) { }

    

    // Sign up with email/password
    SignUp(email, password) {

    }


    // Reset Forggot password
    ForgotPassword(passwordResetEmail) {

    }

    // Returns true when user is looged in and email is verified
    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user !== null) ? true : false;
        // return true;
    }

    // Sign out
    SignOut() {
        localStorage.removeItem('user');
        localStorage.removeItem('op');
        localStorage.removeItem('numChamado');
        localStorage.removeItem('recurso');
        localStorage.removeItem('cadProd');
        this.router.navigate(['sign-in']);
        window.location.reload();
    }
}
