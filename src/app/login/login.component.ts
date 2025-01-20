import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { ProfileService } from '../services/profile/profile.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null; // To store login error messages

  constructor(
    private loginService: LoginService,
    private router: Router,
    private profileService: ProfileService,
  ) { }

  onLogin() {
    if (!this.username || !this.password) {
      this.loginError = !this.username && !this.password
        ? 'User ID and Password are required.'
        : !this.username
          ? 'User ID is required.'
          : 'Password is required.';
      return;
    }

    const data = {
      username: this.username,
      password: this.password,
    };

    this.loginService.login(data).subscribe({
      next: (response) => {
        localStorage.setItem('jwtToken', response.token);
        this.profileService.getProfile().subscribe({
          next: (profile) => {
            console.log('Profile:', profile);
            localStorage.setItem('role', profile.data.role);
            localStorage.setItem('firstLogin', profile.data.firstLogin);
            localStorage.setItem('username', this.username);
            if (profile.data.firstLogin === false) {
              this.router.navigate(['/layout']);
            }else{
              this.router.navigate(['/password-reset']);
            }
          },
          error: (error) => {
            console.error(error.error.message, error);
          },
        });
      },
      error: (error) => {
        this.loginError = error.error.message;
      },
    });
  }
}
