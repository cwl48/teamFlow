/**
 * Created by 李 on 2017/4/1.
 */
import { Directive, ElementRef, Input, OnChanges, Sanitizer, SecurityContext,
  SimpleChanges } from '@angular/core';

// Sets the element's innerHTML to a sanitized version of [safeHtml]
@Directive({ selector: '[safeHtml]' })
export class HtmlDirective implements OnChanges {
  @Input() safeHtml: string;

  constructor(private elementRef: ElementRef, private sanitizer: Sanitizer) {}

  ngOnChanges(changes: SimpleChanges): any {
    if ('safeHtml' in changes) {
      this.elementRef.nativeElement.innerHTML =
        this.sanitizer.sanitize(SecurityContext.HTML, this.safeHtml);
    }
  }
}
