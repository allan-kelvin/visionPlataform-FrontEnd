import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Area } from '../../../core/models/area.model';
import { AreaService } from '../../../core/services/area.service';

@Component({
  selector: 'app-area-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './area-list.html',
  styleUrl: './area-list.scss',
})
export class AreaListComponent implements OnInit {

  displayedColumns = ['id', 'descricao', 'acoes'];
  dataSource = new MatTableDataSource<Area>();
  pageSize = 5;
  pageIndex = 0;
  totalPages = 0;
  pages: number[] = [];

  data: Area[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtroId = '';
  filtroDescricao = '';

  constructor(
    private service: AreaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource._updateChangeSubscription();

  }

  load() {
    this.service.getAll().subscribe(res => {
      this.data = res;
      this.totalPages = Math.ceil(this.data.length / this.pageSize);
      this.pages = Array(this.totalPages).fill(0);
      this.atualizarPagina();
    });
  }

  aplicarFiltro() {
    const filtro = this.filtroDescricao.trim().toLowerCase();
    this.dataSource.filter = filtro;
  }

  novo() {
    this.router.navigate(['/areas/nova']);
  }

  editar(id: number) {
    this.router.navigate(['/areas', id]);
  }

  excluir(id: number) {
    this.service.delete(id).subscribe(() => this.load());
  }

  atualizarPagina() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.dataSource.data = this.data.slice(start, end);
  }

  irParaPagina(index: number) {
    this.pageIndex = index;
    this.atualizarPagina();
  }

  proximaPagina() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.atualizarPagina();
    }
  }

  paginaAnterior() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.atualizarPagina();
    }
  }
}
