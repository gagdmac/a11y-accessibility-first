import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent {
  @ViewChild('aboutMeTitle') aboutMeTitle!: ElementRef<HTMLHeadingElement>;

  // Set focus to H1 for screen reader announcement following WCAG 1.3.2 meaningful sequence
  // tabindex="-1" allows programmatic focus without adding to tab order
  // Screen readers can navigate all content using virtual cursor
  onOffcanvasShown(): void {
    setTimeout(() => {
      if (this.aboutMeTitle) {
        this.aboutMeTitle.nativeElement.focus();
      }
    }, 300); // Increased timeout to ensure offcanvas is fully rendered
  }
}
