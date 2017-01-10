import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './core/dashboard.component';
import { LoginComponent } from "./login/login.component";
import { MainComponent }   from './core/main.component';
import { RecipeDetailComponent, CanDeactivateRecipeDetail }   from './recipes/recipe-detail.component';
import { RecipeFormComponent }   from './recipes/recipe-form.component';
import { Gatekeeper } from './core/gatekeeper.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'recipes',
        pathMatch: 'full',
    },
    {
        path: 'recipes',
        component: MainComponent,
        canActivate: [Gatekeeper],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'add', component: RecipeFormComponent },
            { path: 'detail/:id', component: RecipeDetailComponent, canDeactivate: [CanDeactivateRecipeDetail] },
            { path: 'edit/:id', component: RecipeFormComponent },
        ]
    },
    { path: 'login', component: LoginComponent, canActivate: [Gatekeeper] },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}