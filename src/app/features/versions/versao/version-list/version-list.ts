import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { VersionService } from '../../../../core/services/versions/version.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-version-list',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './version-list.html',
  styleUrl: './version-list.scss',
})
export class VersionListComponent implements OnInit {


  private versionService = inject(VersionService);
  private userService = inject(UserService);
  private router = inject(Router);

  //modal
  private dialog = inject(MatDialog);

  versions: any[] = [];


  users: any[] = [];
  userMap: any = {};

  search = '';
  status = '';
  creator = '';

  Math = Math;
  filtered: any[] = [];
  selectedIds: number[] = [];

  page = 1;
  pageSize = 5;

  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit() {

    this.loadUsers();
    this.loadVersions();

  }

  loadUsers() {
    this.userService.getAll().subscribe(res => {
      this.users = res;
      res.forEach(u => {
        this.userMap[u.id] = u.nome;
      });
    });
  }

  loadVersions() {

    this.versionService.getAll().subscribe(res => {
      this.versions = res;
      this.filtered = res;
    });

  }

  getCreatorName(id: number) {
    return this.userMap[id] ?? '-';
  }

  filtrar() {

    this.filtered = this.versions.filter(v => {

      const searchMatch =
        !this.search ||
        v.numeroVersao.toLowerCase().includes(this.search.toLowerCase());

      const statusMatch =
        !this.status ||
        v.statusVersao === this.status;

      const creatorMatch =
        !this.creator ||
        v.criadorId === Number(this.creator);

      return searchMatch && statusMatch && creatorMatch;

    });

  }

  ordenar(coluna: string) {

    if (this.sortColumn === coluna) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = coluna;
      this.sortDirection = 'asc';
    }

    this.filtered.sort((a, b) => {

      let valueA = a[coluna];
      let valueB = b[coluna];

      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;

      return 0;

    });

  }

  novaVersao() {
    this.router.navigate(['/versions/new']);
  }

  editar(version: any) {

    this.router.navigate(['/versions/edit', version.id]);

  }
  excluir(v: any) {

    if (!confirm('Deseja excluir esta versão?')) return;

    this.versionService.delete(v.id).subscribe(() => {
      this.loadVersions();
    });

  }

  get paginated() {

    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);

  }

  //modal de exclusão

  confirmarExclusao(version: any) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      panelClass: 'dialog-dark',

      data: {

        title: 'Excluir versão',
        message: `Deseja excluir a versão ${version.numeroVersao}?`

      }

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.versionService.delete(version.id)
          .subscribe(() => {

            this.loadVersions();

          });

      }

    });

  }

  toggleSelection(id: number) {

    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    } else {
      this.selectedIds.push(id);
    }
  }

  liberarVersao() {

    if (this.selectedIds.length !== 1) {
      alert('Selecione apenas uma versão para liberar');
      return;
    }

    const versionId = this.selectedIds[0];

    this.versionService.release(versionId)
      .subscribe(() => {

        this.selectedIds = [];

        this.loadVersions();

      });

  }
}
