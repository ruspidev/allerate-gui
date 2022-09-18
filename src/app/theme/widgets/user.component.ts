import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@core/auth/account.service';
import { AuthServerProvider } from '@core/auth/auth-jwt.service';
import { Account } from '@core/auth/account.model';

@Component({
  selector: 'app-user',
  template: `
    <button class="matero-toolbar-button matero-avatar-button" mat-button [matMenuTriggerFor]="menu">
      <span class="matero-username" fxHide.lt-sm>{{ account?.firstName }}{{ account?.lastName }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/settings" mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>{{ 'user.settings' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'user.logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
})
export class UserComponent implements OnInit {
  account: Account | undefined;

  constructor(private router: Router, private accountService: AccountService, private auth: AuthServerProvider) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(acc => {
      if (acc) {
        this.account = acc;
      }
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
  }
}
