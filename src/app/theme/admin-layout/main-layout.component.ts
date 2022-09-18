import {
  Component,
  OnDestroy,
  ViewChild,
  HostBinding,
  ElementRef,
  Inject,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { SettingsService } from '@theme/services/settings.service';
import { AppSettings } from '@theme/model/settings';

const MOBILE_MEDIAQUERY = 'screen and (max-width: 599px)';
const TABLET_MEDIAQUERY =
  'screen and (min-width: 600px) and (max-width: 959px)';
const MONITOR_MEDIAQUERY = 'screen and (min-width: 960px)';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminLayoutComponent implements OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;

  options = this.settings.getOptions();

  private layoutChangesSubscription: Subscription;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  private isMobileScreen = false;

  @HostBinding('class.matero-content-width-fix')
  get contentWidthFix(): boolean {
    return (
      this.isContentWidthFixed &&
      this.options.navPos === 'side' &&
      this.options.sidenavOpened &&
      !this.isOver
    );
  }

  private isContentWidthFixed = true;

  @HostBinding('class.matero-sidenav-collapsed-fix')
  get collapsedWidthFix(): boolean {
    return (
      this.isCollapsedWidthFixed &&
      (this.options.navPos === 'top' ||
        (this.options.sidenavOpened && this.isOver))
    );
  }

  private isCollapsedWidthFixed = false;

  constructor(
    private router: Router,
    private mediaMatcher: MediaMatcher,
    private breakpointObserver: BreakpointObserver,
    private overlay: OverlayContainer,
    private element: ElementRef,
    private settings: SettingsService,
    @Optional() @Inject(DOCUMENT) private document: Document
  ) {
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_MEDIAQUERY, TABLET_MEDIAQUERY, MONITOR_MEDIAQUERY])
      .subscribe(state => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;

        this.isMobileScreen = state.breakpoints[MOBILE_MEDIAQUERY];
        this.options.sidenavCollapsed = state.breakpoints[TABLET_MEDIAQUERY];
        this.isContentWidthFixed = state.breakpoints[MONITOR_MEDIAQUERY];
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isOver) {
          this.sidenav.close().then();
        }
        this.content.scrollTo({ top: 0 });
      });

    if (this.options.theme === 'auto') {
      this.setAutoTheme();
    }

    // Initialize project theme with options
    this.receiveOptions(this.options);
  }

  ngOnDestroy(): void {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed(): void {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  // TODO: Trigger when transition end
  resetCollapsedState(timer = 400): void {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart(): void {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean): void {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  setAutoTheme(): void {
    // Check whether the browser support `prefers-color-scheme`
    if (
      this.mediaMatcher.matchMedia('(prefers-color-scheme)').media !== 'not all'
    ) {
      const isSystemDark = this.mediaMatcher.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      // Set theme to dark if `prefers-color-scheme` is dark. Otherwise, set it to light.
      this.options.theme = isSystemDark ? 'dark' : 'light';
    } else {
      // If the browser does not support `prefers-color-scheme`, set the default to light.
      this.options.theme = 'light';
    }
  }

  // Demo purposes only

  receiveOptions(options: AppSettings): void {
    this.options = options;
    this.toggleDarkTheme(options);
  }

  toggleDarkTheme(options: AppSettings): void {
    if (options.theme === 'dark') {
      this.element.nativeElement.classList.add('theme-dark');
      this.overlay.getContainerElement().classList.add('theme-dark');
    } else {
      this.element.nativeElement.classList.remove('theme-dark');
      this.overlay.getContainerElement().classList.remove('theme-dark');
    }
  }
}
