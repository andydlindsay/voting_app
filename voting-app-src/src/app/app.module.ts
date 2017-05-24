import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { D3Service } from 'd3-ng2-service';
import { ChartsModule } from 'ng2-charts';
import { AuthService } from './services/auth.service';
import { PollService } from './services/poll.service';
import { UservalidateService } from './services/uservalidate.service';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PollComponent } from './components/poll/poll.component';
import { PollformComponent } from './components/pollform/pollform.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'poll/new', component: PollformComponent, canActivate: [AuthGuard] },
  { path: 'poll/:id', component: PollComponent },
  { path: '**', redirectTo: '/' }
]

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    PollComponent,
    PollformComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    FlashMessagesModule,
    FlexLayoutModule,
    ChartsModule,
    JsonpModule
  ],
  providers: [
    Title,
    D3Service,
    AuthService,
    UservalidateService,
    AuthGuard,
    PollService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
