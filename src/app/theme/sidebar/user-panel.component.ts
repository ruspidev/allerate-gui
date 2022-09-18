import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServerProvider } from '@core/auth/auth-jwt.service';
import { AccountService } from '@core/auth/account.service';
import { Account } from '@core/auth/account.model';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="allerate-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <h4 class="allerate-user-panel-name">{{ account?.firstName }}{{ account?.lastName }}</h4>
      <h5 class="allerate-user-panel-email">{{ account?.email }}</h5>
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
