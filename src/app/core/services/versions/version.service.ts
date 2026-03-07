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
}
