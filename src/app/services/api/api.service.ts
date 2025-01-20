import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environement';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.baseURL; // environment variable for baseUrl
  constructor(private httpClient: HttpClient) {}

  private getHeaders(requiresAuth: boolean = true): HttpHeaders { 
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    if (requiresAuth) {
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      if (token && token.trim() !== "") {
        headers = headers.set('Authorization', `Bearer ${token}`);
        console.log(headers);
      } else {
        console.error("JWT token is missing or invalid");
      }
    }
  
    return headers;
  }
  

  get<T>(endpoint: string, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.get<T>(url, { headers: this.getHeaders() });
  }

  post<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = true
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.post<T>(url, data, {
      headers: this.getHeaders(requiresAuth),
    });
  }

  put<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = true
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.put<T>(url, data, { headers: this.getHeaders() });
  }
  delete<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = true
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.httpClient.delete<T>(url, { headers: this.getHeaders() });
  }
}
