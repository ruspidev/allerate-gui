import { Component, ViewChild, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TopmenuState } from './topmenu.component';
import { MenuChildrenItem, MenuService } from '@core/bootstrap/menu.service';

@Component({
  selector: 'app-topmenu-panel',
  templateUrl: './topmenu-panel.component.html',
})
export class TopmenuPanelComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenu, { static: true }) menuPanel!: MatMenu;

  @Input() items: MenuChildrenItem[] = [];
  @Input() parentRoute: string[] = [];
  @Input() level = 1;
  @Output() routeChange = new EventEmitter<any>();

  menuStates: TopmenuState[] = [];

  buildRoute = this.menu.buildRoute;

  private routerSubscription!: Subscription;

  constructor(private menu: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.items.forEach(item => {
      this.menuStates.push({
        active: this.checkRoute(item),
        route: item.route,
      });
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  checkRoute(item: MenuChildrenItem): boolean {
    if (!item.route && item.children) {
      return this.checkChildRoute(item.children);
    } else {
      return this.router.url.split('/').includes(item.route);
    }
  }

  checkChildRoute(menuItems: MenuChildrenItem[]): boolean {
    return menuItems.some(child => {
      if (this.router.url.split('/').includes(child.route)) {
        return true;
      }
      if (!child.route && child.children) {
        this.checkChildRoute(child.children);
      }
      return false;
    });
  }

  onRouterLinkClick(rla: RouterLinkActive): void {
    this.routeChange.emit(rla);
  }

  onRouteChange(rla: RouterLinkActive, index: number): void {
    this.routeChange.emit(rla);

    this.routerSubscription?.unsubscribe();
    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.menuStates.forEach(item => (item.active = false));
      setTimeout(() => (this.menuStates[index].active = rla.isActive));
    });
  }
}
