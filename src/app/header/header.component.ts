import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralPopupComponent } from '../general-popup/general-popup.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  userRealname: string | null = null;
  role: string | null = null;
  branchList: { branchId: string; branchName: string }[] = [];
  isDropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private renderer: Renderer2,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.username = localStorage.getItem('username');
      this.userRealname = localStorage.getItem('realUsername');
      this.role = localStorage.getItem('role');

      const storedBranchList = localStorage.getItem('branchList');
      if (storedBranchList) {
        try {
          this.branchList = JSON.parse(storedBranchList);
        } catch (error) {
          console.error('Error parsing branchList from localStorage:', error);
          this.branchList = [];
        }
      }
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(GeneralPopupComponent, {
      data: { header: 'Confirm', message: 'Are you sure you want to proceed?' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.clear();
        }
        this.router.navigate(['/login']);
      }
    });
  }


}
