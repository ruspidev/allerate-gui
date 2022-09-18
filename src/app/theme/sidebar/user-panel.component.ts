import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@core/authentication';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="allerate-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <h4 class="allerate-user-panel-name">{{ user.name }}</h4>
      <h5 class="allerate-user-panel-email">{{ user.email }}</h5>
      <div class="allerate-user-panel-icons">
        <a routerLink="/profile/settings" mat-icon-button>
          <mat-icon class="icon-18">settings</mat-icon>
        </a>
        <a (click)="logout()" mat-icon-button>
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  user!: User;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
  }
}
