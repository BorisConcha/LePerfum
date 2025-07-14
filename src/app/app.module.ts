import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login/login.component';
import { RegisterComponent } from './components/auth/register/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgotPassword/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { HomeComponent } from './components/home/home/home.component';
import { PerfumeListComponent } from './components/perfume-list/perfume-list.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { NavbarComponent } from './components/shared/navbar/navbar/navbar.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { PerfumeService } from './services/perfume.service';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'perfumes', component: PerfumeListComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    HomeComponent,
    PerfumeListComponent,
    AdminDashboardComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [AuthGuard, AdminGuard, PerfumeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
