import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/auth/auth.service';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  search = '';

  userName = 'Allan';
  userInitial = 'A';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  routes = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Usuários', path: '/usuarios' },
    { name: 'Clientes', path: '/clientes' },
    { name: 'Áreas', path: '/areas' },
    { name: 'Planejamento de versões', path: '/planejamento' },
    { name: 'Versões', path: '/versions' }
  ];

  searchPage() {

    if (!this.search) return;

    const term = this.search.toLowerCase();

    const result = this.routes.find(r =>
      r.name.toLowerCase().includes(term)
    );

    if (result) {

      this.router.navigate([result.path]);

      this.search = '';

    } else {

      console.warn('Tela não encontrada');

    }

  }

  goToProfile() {

    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('Usuário não encontrado no token' + userId);
      return;
    }

    this.router.navigate(['/usuarios', userId]);

  }

  logout() {
    this.authService.logout();
  }
}
