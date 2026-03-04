import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environment/environment";
import { CreateUser, UpdateUser, User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  create(dto: CreateUser) {
    return this.http.post(this.api, dto);
  }

  update(id: number, dto: UpdateUser) {
    return this.http.put(`${this.api}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
