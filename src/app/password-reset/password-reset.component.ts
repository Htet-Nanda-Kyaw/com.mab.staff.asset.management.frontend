import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile/profile.service';
import { Router } from '@angular/router';
import { GeneralPopupComponent } from '../general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private dialog: MatDialog,
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { newPassword } = this.passwordForm.value;
      const data = {
        username: localStorage.getItem('username'),
        password: newPassword,
      };

      this.profileService.updatePassword(data).subscribe({
        next: (response) => {
          this.dialog.open(GeneralPopupComponent, {
            data: { header: 'Confirm', message: response.message },
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/layout']);
          });
        },
        error: (error) => {
          console.error(error.error.message, error);
        },
      });
    } else {
      this.dialog.open(GeneralPopupComponent, {
        data: { header: 'Error', message: 'Form is not valid' },
      });
    }
  }
}
