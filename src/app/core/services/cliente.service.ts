import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {

  private api = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`);
  }

  create(nome: string) {
    return this.http.post(this.api, { nome });
  }

  update(id: number, nome: string) {
    return this.http.put(`${this.api}/${id}`, { nome });
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

}
