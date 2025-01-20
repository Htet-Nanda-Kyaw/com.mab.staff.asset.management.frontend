import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwtToken');
      if (token && this.isTokenValid(token)) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      return false;
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token); // Decode the JWT token
      const currentTime = Date.now() / 1000; // Get current time in seconds
      if (decoded.exp && decoded.exp > currentTime) {
        return true; // Token is valid
      } else {
        return false; // Token is expired
      }
    } catch (error) {
      return false; // Invalid token
    }
  }
}
