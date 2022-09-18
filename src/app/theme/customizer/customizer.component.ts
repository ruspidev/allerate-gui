import { Component, Output, EventEmitter, ViewEncapsulation, TemplateRef } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MtxDrawer, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import { AppSettings } from '@theme/model/settings';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomizerComponent {
  @Output() optionsChange = new EventEmitter<AppSettings>();

  options = this.settings.getOptions();

  dragging = false;

  drawerRef?: MtxDrawerRef;

  constructor(private settings: SettingsService, private drawer: MtxDrawer) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  openPanel(templateRef: TemplateRef<any>): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }

    this.drawerRef = this.drawer.open(templateRef, {
      position: 'right',
      width: '320px',
    });
  }

  closePanel(): void {
    this.drawerRef?.dismiss();
  }

  sendOptions(): void {
    this.optionsChange.emit(this.options);
  }
}
