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
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.dataSource.data = res;
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
}
