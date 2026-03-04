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
    MatIconModule
  ],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.scss',
})
export class ClienteListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>();

  filtroForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: ClienteService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      id: [''],
      nome: ['']
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  filtrar() {
    const { id, nome } = this.filtroForm.value;

    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      const search = JSON.parse(filter);
      return (
        (!search.id || data.id.toString().includes(search.id)) &&
        (!search.nome || data.nome.toLowerCase().includes(search.nome.toLowerCase()))
      );
    };

    this.dataSource.filter = JSON.stringify({ id, nome });
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

}
