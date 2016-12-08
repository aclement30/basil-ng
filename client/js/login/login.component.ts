import { Component } from '@angular/core';

@Component({
    selector: 'login',
    template: `
        <div class="l-block toggled">
            <div class="lb-header palette-Teal bg">
                <i class="zmdi zmdi-account-circle"></i>
                Bienvenue ! Veuillez vous connecter : 
            </div>

            <div class="lb-body">
                <button type="button" onclick="window.location='/auth/google'" class="btn btn-primary btn-icon-text waves-effect login bg"><i class="zmdi zmdi-google"></i> Connexion</button>
            </div>
        </div>
    `
})

export class LoginComponent { }