import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
<div class="dialog">

  <h2 class="title">
    {{data.title}}
  </h2>

  <p class="message">
    {{data.message}}
  </p>

  <div class="actions">

    <button
      class="btn-cancel"
      (click)="cancel()">
      Cancelar
    </button>

    <button
      class="btn-delete"
      (click)="confirm()">
      Excluir
    </button>

  </div>

</div>
`,
})

export class ConfirmDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
