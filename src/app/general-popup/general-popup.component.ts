import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-general-popup',
  standalone: false,

  templateUrl: './general-popup.component.html',
  styleUrls: ['./general-popup.component.scss']
})
export class GeneralPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<GeneralPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; header: string; icon: string }
  ) { }
  
  confirmAction(): void {
    console.log('Confirmation action triggered');
    this.dialogRef.close(true); // Close the dialog and pass a true value for confirmation
  }
}
