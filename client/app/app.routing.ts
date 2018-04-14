import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipesListComponent } from './home/recipes-list.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './core/main.component';
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
      { path: 'add', component: RecipeFormComponent },
      { path: 'user/:userId', children: [
        { path: '', component: RecipesListComponent },
        { path: 'tag/:tag', component: RecipesListComponent },
      ] },
      { path: 'detail/:id', component: RecipeDetailComponent, canDeactivate: [CanDeactivateRecipeDetail] },
      { path: 'edit/:id', component: RecipeFormComponent },
      { path: '', component: RecipesListComponent },
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
