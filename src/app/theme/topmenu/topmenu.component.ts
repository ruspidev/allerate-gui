import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Menu, MenuService } from '@core/bootstrap/menu.service';

export interface TopmenuState {
  active: boolean;
  route: string;
}

@Component({
  selector: 'app-topmenu',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'matero-topmenu',
  },
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopmenuComponent implements OnDestroy {
  menu$ = this.menu.getAll();
  buildRoute = this.menu.buildRoute;

  menuList: Menu[] = [];
  menuStates: TopmenuState[] = [];

  private menuSubscription: Subscription;
  private routerSubscription!: Subscription;

  constructor(private menu: MenuService, private router: Router) {
    this.menuSubscription = this.menu$.subscribe(res => {
      this.menuList = res;
      this.menuList.forEach(item => {
        this.menuStates.push({
          active: this.router.url.split('/').includes(item.route),
          route: item.route,
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  onRouteChange(rla: RouterLinkActive, index: number): void {
    this.routerSubscription?.unsubscribe();
    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.menuStates.forEach(item => (item.active = false));
      setTimeout(() => (this.menuStates[index].active = rla.isActive));
    });
  }
}
