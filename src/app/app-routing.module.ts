import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {RegisterComponent} from './layouts/auth-layout/register/register.component';
import {LoginComponent} from './layouts/auth-layout/login/login.component';
import {SiteLayoutComponent} from './layouts/site-layout/site-layout.component';
import {LessonComponent} from './layouts/site-layout/tutorials/lesson/lesson.component';
import {TestComponent} from './layouts/site-layout/tutorials/test/test.component';
import {AuthGuard} from './services/auth.guard';
import {GuestGuard} from './services/guest.guard';


const routes: Routes = [
  {path: 'auth', component: AuthLayoutComponent, canActivate: [GuestGuard], children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: '**', redirectTo: '/auth/login'}
    ]},
  {path: 'home', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'lesson/:id', component: LessonComponent},
      {path: 'test/:id', component: TestComponent},
      {path: '**', redirectTo: '/home'}
    ]},
  {path: '**', redirectTo: '/auth/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
