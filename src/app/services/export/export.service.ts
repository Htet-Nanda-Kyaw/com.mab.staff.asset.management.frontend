import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { environment } from '../../environments/environement';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private apiService: ApiService) { }
  getAllAssets(): Observable<any> {
    const endPoint = environment.getAllAssets;
    return this.apiService.get(endPoint);
  }
  getAllUsersWithoutAssets(): Observable<any> {
    const endPoint = environment.getUsersWithoutAssets;
    return this.apiService.get(endPoint);
  }

}
