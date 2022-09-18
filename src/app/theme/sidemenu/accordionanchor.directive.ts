import { Directive, HostListener, Inject } from '@angular/core';

import { AccordionItemDirective } from './accordionItem.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[navAccordionToggle]',
})
export class AccordionAnchorDirective {
  protected navlink: AccordionItemDirective;

  constructor(@Inject(AccordionItemDirective) navlink: AccordionItemDirective) {
    this.navlink = navlink;
  }

  @HostListener('click', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(e: MouseEvent): void {
    this.navlink.toggle();
  }
}
