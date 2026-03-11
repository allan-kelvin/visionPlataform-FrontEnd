import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Version } from '../../models/version.model';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private http = inject(HttpClient);

  private api = environment.apiUrl + '/versions';

  getAll(): Observable<Version[]> {
    return this.http.get<Version[]>(this.api);
  }

  getById(id: number): Observable<Version> {
    return this.http.get<Version>(`${this.api}/${id}`);
  }

  create(data: any): Observable<number> {
    return this.http.post<number>(this.api, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);

  }

  delete(id: number) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }
}
