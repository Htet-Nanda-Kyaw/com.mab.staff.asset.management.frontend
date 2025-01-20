import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service'; 
import { environment } from '../../environments/environement'; 

interface LoginResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  endPoint: string = environment.loginURL;
  constructor(private apiService: ApiService) { }
  login(data: any): Observable<LoginResponse> {
    console.log(data);
    return this.apiService.post(this.endPoint, data, false);
  }
}
