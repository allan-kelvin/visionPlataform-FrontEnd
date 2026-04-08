import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { DashboardResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/dashboard`;

  getDashboard(inicio?: string, fim?: string) {
    return this.http.get<DashboardResponse>(
      this.api,
      {
        params: {
          ...(inicio && { inicio }),
          ...(fim && { fim })
        }
      }
    );
  }
}
