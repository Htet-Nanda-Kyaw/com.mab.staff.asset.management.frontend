import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { environment } from '../../environments/environement';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private apiService: ApiService) { }

  getProfile(): Observable<any> {
    const endPoint = environment.profileURL;
    return this.apiService.get(endPoint);
  }
  updatePassword(data: any): Observable<any> {
    const endPoint = environment.updatePassword;
    return this.apiService.post(endPoint, data, true);
  }
  adminUpdatePassword(data: any): Observable<any> {
    const endPoint = `${environment.adminUpdatePassword}?userName=${data}`;
    return this.apiService.post(endPoint, null, true);
  }
}
