import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { VersionTask } from '../../models/version-task.model';

@Injectable({
  providedIn: 'root',
})
export class VersionTaskService {

  private http = inject(HttpClient);

  private api = environment.apiUrl + '/VersionTasks';

  // ===============================
  // LISTAR POR VERSÃO
  // ===============================

  getByVersion(versionId: number): Observable<VersionTask[]> {

    return this.http.get<VersionTask[]>(
      `${this.api}/by-version/${versionId}`
    );

  }

  // ===============================
  // CRIAR TAREFA
  // ===============================

  create(dto: any): Observable<number> {

    return this.http.post<number>(
      this.api,
      dto
    );

  }

  // ===============================
  // ATUALIZAR
  // ===============================

  update(id: number, dto: any) {

    return this.http.put(
      `${this.api}/${id}`,
      dto
    );

  }

  // ===============================
  // EXCLUIR
  // ===============================

  delete(id: number) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }
}
