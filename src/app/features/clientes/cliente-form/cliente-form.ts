import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';

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
  private notify = inject(NotificationService);

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Nome do cliente é obrigatório!');
      return;
    }

    const nome = this.form.value.nome!;

    if (this.id) {
      this.service.update(this.id, nome).subscribe({
        next: () => {
          this.notify.success('Cliente atualizado com sucesso!');
          this.router.navigate(['/clientes']);
        },
        error: () => {
          this.notify.error('Erro ao atualizar cliente!');
        }
      });
    } else {
      this.service.create(nome).subscribe({
        next: () => {
          this.notify.success('Cliente cadastrado com sucesso!');
          this.router.navigate(['/clientes']);
        },
        error: () => {
          this.notify.error('Erro ao cadastrar cliente!');
        }
      });
    }
  }
}
