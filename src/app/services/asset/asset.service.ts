import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service'; 
import { environment } from '../../environments/environement'; 

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  getAssignedAssets(): Observable<any> {
    const endPoint = '/asset/search';
    return this.apiService.get(endPoint,true);
  }
  saveAssignedAssets(payload: any): Observable<any> {
    const endPoint = environment.saveAssets;
    return this.apiService.post(endPoint,payload,true);
  }
  getAssets(baseURL: string): Observable<any> {
    return this.apiService.get(baseURL);
  }
  getRefCategories(): Observable<any> {
    const endPoint = environment.getAllRefCategories;
    return this.apiService.get(endPoint);
  }
  constructor(private apiService: ApiService) { }
}
