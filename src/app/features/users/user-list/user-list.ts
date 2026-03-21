import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoleService } from '../../../core/services/role.service';
import { UserService } from '../../../core/services/user.service';



@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, MatIconModule,],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserListComponent implements OnInit {

  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);

  users: any[] = [];
  roles: any[] = [];

  filtro = {
    id: '',
    nome: '',
    roleId: 0
  };

  page = 1;
  pageSize = 5;


  get paginatedUsers() {
    const start = (this.page - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  goToPage(p: number) {
    this.page = p;
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error(err)
    });
  }

  loadRoles() {
    this.roleService.getAll().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => console.error(err)
    });
  }

  filtrar() {
    this.loadUsers();

    this.users = this.users.filter(u => {
      const matchId =
        this.filtro.id === '' ||
        u.id.toString().includes(this.filtro.id);

      const matchNome =
        this.filtro.nome === '' ||
        u.nome.toLowerCase().includes(this.filtro.nome.toLowerCase());

      const matchRole =
        this.filtro.roleId === 0 ||
        u.roleId === this.filtro.roleId;

      return matchId && matchNome && matchRole;
    });
  }

  editar(id: number) {
    this.router.navigate(['/usuarios', id]);
  }

  excluir(id: number) {
    if (!confirm('Deseja realmente excluir este usuário?')) return;

    this.userService.delete(id).subscribe(() => {
      this.loadUsers();
    });
  }

  novo() {
    this.router.navigate(['/usuarios/novo']);
  }

}
