import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent {
  @ViewChild('aboutMeTitle') aboutMeTitle!: ElementRef<HTMLHeadingElement>;

  // Set focus to the heading for TalkBack and other screen readers
  onOffcanvasShown(): void {
    setTimeout(() => {
      if (this.aboutMeTitle) {
        this.aboutMeTitle.nativeElement.focus();
      }
    }, 100);
  }
}
