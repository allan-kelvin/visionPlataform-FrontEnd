import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../core/services/cliente.service';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-cliente-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.scss',
})
export class ClienteListComponent implements OnInit {

  pages: number[] = [];
  totalPages = 0;
  displayedColumns: string[] = ['id', 'nome', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>();
  sortField: keyof Cliente = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 5;
  filtered: any[] = [];
  clientes: Cliente[] = [];
  filtroForm!: FormGroup;

  get showingEnd() {
    return Math.min(
      this.page * this.pageSize,
      this.filtered.length
    );
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: ClienteService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.filtroForm = this.fb.group({
      id: [''],
      nome: [''],
    });
  }

  ngOnInit() {
    this.load();
  }


  private calcularPaginacao() {

    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);

    this.pages = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

  }

  load() {
    this.service.getAll().subscribe(data => {
      this.clientes = data;
      this.filtered = [...data];
      this.page = 1;
      this.calcularPaginacao();
      this.atualizarPagina();
    });
  }

  atualizarPagina() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.dataSource.data = this.filtered.slice(start, end);
  }

  irParaPagina(p: number) {
    this.page = p;
    this.filtered
    this.atualizarPagina();
  }

  proximaPagina() {
    if (this.page < this.totalPages) {
      this.page++;
      this.atualizarPagina();
    }
  }

  paginaAnterior() {
    if (this.page > 1) {
      this.page--;
      this.atualizarPagina();
    }
  }

  filtrar() {
    const { id, nome } = this.filtroForm.value;

    this.filtered = this.clientes.filter((c: Cliente) => {
      return (
        (!id || c.id.toString().includes(id)) &&
        (!nome || c.nome.toLowerCase().includes(nome.toLowerCase()))
      );
    });

    this.page = 1;

    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);
    this.pages = Array(this.totalPages).fill(0);

    this.atualizarPagina();
  }

  novo() {
    this.router.navigate(['/clientes/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/clientes', id]);
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

  selectedRow: any = null;

  selectRow(row: any) {
    this.selectedRow = row;
  }

  onRowDoubleClick(row: any) {
    this.selectedRow = row;
    this.editar(row.id);
  }

  sort(field: keyof Cliente) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.dataSource.data = [...this.dataSource.data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
