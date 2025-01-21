import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './auth.guard';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AssetAssignComponent } from './asset-assign/asset-assign.component';
import { ExportPageComponent } from './export-page/export-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
    canActivate: [authGuard],
  },
  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      {path:'asset-assign', component: AssetAssignComponent},
      {path:'export-page', component: ExportPageComponent}
    ],
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
