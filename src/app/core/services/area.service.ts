import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Area, CreateArea } from '../models/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private api = `${environment.apiUrl}/areas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(this.api);
  }
  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(data: CreateArea): Observable<number> {
    return this.http.post<number>(this.api, data);
  }

  update(id: number, data: CreateArea): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
