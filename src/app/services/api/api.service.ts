import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environement';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.baseURL; // environment variable for baseUrl

  constructor(private httpClient: HttpClient) { }

  // Headers function with optional authentication
  private getHeaders(requiresAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',  // Ensure JSON is sent
    });

    if (requiresAuth) {
      const token = localStorage.getItem('jwtToken');
      console.log('Token:', token);  // Log the token for debugging
      if (token && token.trim() !== '') {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.error('JWT token is missing or invalid');
      }
    }

    return headers;
  }

  // GET method
  get<T>(endpoint: string, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.get<T>(url, { headers: this.getHeaders(requiresAuth) });
  }

  // POST method
  post<T>(endpoint: string, data: any, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.post<T>(url, data, {
      headers: this.getHeaders(requiresAuth),
    });
  }

  // PUT method
  put<T>(endpoint: string, data: any, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.put<T>(url, data, { headers: this.getHeaders(requiresAuth) });
  }

  // DELETE method
  delete<T>(endpoint: string, data: any, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.delete<T>(url, { headers: this.getHeaders(requiresAuth) });
  }
}
