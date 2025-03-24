import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent implements OnInit {
  menuItems = [
    { label: 'Asset Assign', link: '/layout/asset-assign', icon: 'fas fa-file-alt', roles: ['ADMIN','USER'] },
    { label: 'Password Reset', link: '/layout/admin-password-reset', icon: 'fas fa-solid fa-key', roles: ['ADMIN'] },
    { label: 'Export', link: '/layout/export-page', icon: 'fas fa-solid fa-file-export', roles: ['ADMIN'] },
  ];
  userRole: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Fetch the role from local storage
    this.userRole = localStorage.getItem('role')||'';
    if (this.userRole) {
      // Filter menu items based on the role
      this.menuItems = this.menuItems.filter(item => item.roles.includes(this.userRole));
    }
  }

  isActive(link: string): boolean {
    return this.router.url === link;
  }
}
