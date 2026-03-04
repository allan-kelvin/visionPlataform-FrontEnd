import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss',
})
export class ClienteFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      ativo: [true]
    });
  }

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) {
      this.id = +paramId;

      this.service.getById(this.id).subscribe(cliente => {
        this.form.patchValue({
          nome: cliente.nome
        });
      });
    }
  }
  voltar() {
    this.router.navigate(['/clientes']);
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }

  salvar() {
    if (this.form.invalid) return;

    const nome = this.form.value.nome!;

    if (this.id) {
      this.service.update(this.id, nome)
        .subscribe(() => this.router.navigate(['/clientes']));
    } else {
      this.service.create(nome)
        .subscribe(() => this.router.navigate(['/clientes']));
    }
  }
}
