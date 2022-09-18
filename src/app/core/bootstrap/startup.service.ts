import { Injectable } from '@angular/core';
import { Menu, MenuService } from './menu.service';

const MENUS: Menu[] = [
  {
    route: '/auth/login',
    name: 'login',
    type: 'link',
    icon: 'login',
  },
  {
    route: '/auth/register',
    name: 'register',
    type: 'link',
    icon: 'login',
  },
];

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  constructor(private menuService: MenuService) {}

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.setMenu(MENUS);
      resolve();
    });
  }

  private setMenu(menu: Menu[]): void {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  /*
        private setPermissions(user: User) {
          // In a real app, you should get permissions and roles from the user information.
          const permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
          this.permissonsService.loadPermissions(permissions);
          this.rolesService.flushRoles();
          this.rolesService.addRoles({ ADMIN: permissions });

          // Tips: Alternatively you can add permissions with role at the same time.
          // this.rolesService.addRolesWithPermissions({ ADMIN: permissions });
        }
         */
}
