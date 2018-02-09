import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipesListComponent } from './home/recipes-list.component';
import { RecipesSidebarComponent } from './home/recipes-sidebar.component';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './core/main.component';
import { FormSidebarComponent } from './recipes/form-sidebar.component';
import { RecipeDetailComponent, CanDeactivateRecipeDetail } from './recipes/recipe-detail.component';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';
import { ShoppingListComponent } from './groceries/shopping-list.component';
import { Gatekeeper } from './services/gatekeeper.service';
import { TagsResolver } from './tags/tags.resolver';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'recipes',
        pathMatch: 'full',
    },
    {
        path: 'recipes',
        component: MainComponent,
        resolve: {
            tags: TagsResolver,
        },
        canActivate: [Gatekeeper],
        children: [
            { path: 'tag/:tag', component: RecipesListComponent },
            { path: 'tag/:tag', component: RecipesSidebarComponent, outlet: 'sidebar' },
            { path: 'add', component: RecipeFormComponent },
            { path: 'add', component: FormSidebarComponent, outlet: 'sidebar' },
            { path: 'user/:userId', component: RecipesListComponent },
            { path: 'detail/:id', component: RecipeDetailComponent, canDeactivate: [CanDeactivateRecipeDetail] },
            { path: 'edit/:id', component: RecipeFormComponent },
            { path: 'edit/:id', component: FormSidebarComponent, outlet: 'sidebar' },
            { path: '', component: RecipesListComponent },
            { path: '', component: RecipesSidebarComponent, outlet: 'sidebar', pathMatch: 'full' },
        ]
    },
    {
        path: 'groceries',
        component: MainComponent,
        canActivate: [Gatekeeper],
        children: [
            { path: '', component: ShoppingListComponent },
        ]
    },
    { path: 'login', component: LoginComponent, canActivate: [Gatekeeper] },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
