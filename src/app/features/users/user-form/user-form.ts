import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../core/models/role.model';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { RoleService } from '../../../core/services/role.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);
  private service = inject(UserService);
  private roleService = inject(RoleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  roles: Role[] = [];

  isEdit = false;
  userId?: number;

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    confirmarSenha: [''],
    roleId: [0, [Validators.required, Validators.min(1)]],
    ativo: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.loadRoles(() => {
      if (id) {
        this.isEdit = true;
        this.userId = +id;
        this.loadUser(this.userId);
      }
    });
  }

  loadRoles(callback?: () => void) {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles;

        if (callback) {
          callback(); // 🔥 só chama depois que carregou
        }
      },
      error: (err) => console.error(err)
    });
  }


  loadUser(id: number) {
    this.service.getById(id).subscribe(user => {

      const roleId = Number(user.roleId);

      setTimeout(() => {
        this.form.patchValue({
          nome: user.nome,
          email: user.email,
          roleId: roleId,
          ativo: user.ativo
        });
      });

    });
  }



  //Validar Senha

  private validarSenhas() {
    const senha = this.form.get('senha')?.value;
    const confirmar = this.form.get('confirmarSenha')?.value;

    if (!this.isEdit) {
      if (!senha || !confirmar) {
        this.form.get('senha')?.setErrors({ required: true });
        this.form.get('confirmarSenha')?.setErrors({ required: true });
      } else if (senha !== confirmar) {
        this.form.get('confirmarSenha')?.setErrors({ mismatch: true });
      }
    }
  }


  salvar() {
    this.validarSenhas();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const dto = this.form.getRawValue();

    if (this.isEdit && this.userId) {
      this.service.update(this.userId, dto).subscribe({
        next: () => {
          this.notify.success('Usuário atualizado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: () => {
          this.notify.error('Erro ao atualizar usuário!');
        }
      });
    } else {
      this.service.create(dto).subscribe({
        next: () => {
          this.notify.success('Usuário cadastrado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: () => {
          this.notify.error('Erro ao cadastrar usuário!');
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/usuarios']);
  }
}
