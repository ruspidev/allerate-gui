import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import screenfull from 'screenfull';

@Component({
  selector: 'app-header',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'matero-header',
  },
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() showBranding = false;

  @Output() toggleSidenav = new EventEmitter<void>();

  toggleFullscreen(): void {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}
