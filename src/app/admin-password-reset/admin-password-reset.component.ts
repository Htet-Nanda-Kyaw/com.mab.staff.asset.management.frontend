import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GeneralPopupComponent } from '../general-popup/general-popup.component';
import { ProfileService } from '../services/profile/profile.service';

interface FormData {
  userName: string
}
@Component({
  selector: 'app-admin-password-reset',
  standalone: false,

  templateUrl: './admin-password-reset.component.html',
  styleUrl: './admin-password-reset.component.scss'
})
export class AdminPasswordResetComponent {
  formData: FormData = {
    userName: '',
  };

  constructor(
    private dialog: MatDialog, // Inject MatDialog for popups
    private profileService: ProfileService,
  ) { }

  passwordReset() {
    const dialogRef = this.dialog.open(GeneralPopupComponent, {
      data: { header: 'Confirmation', message: `Are you sure to reset the password of ${this.formData.userName}` },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        this.profileService.adminUpdatePassword(this.formData.userName).subscribe({
          next: (response) => {
            this.dialog.open(GeneralPopupComponent, {
              data: { header: 'Info', message: response.message },
            }).afterClosed().subscribe(() => {
              console.log(response.message);
            });
          },
          error: (error) => {
            this.dialog.open(GeneralPopupComponent, {
              data: { header: 'Info', message: error.error.message },
            }).afterClosed().subscribe(() => {
            console.error(error.error.message, error);
            });
          },
        });
      }
    });
  }
}
