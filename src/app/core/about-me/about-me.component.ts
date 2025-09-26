import { Component } from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent {
  onOffcanvasShown(): void {
    // Focus the title when offcanvas opens for TalkBack accessibility
    setTimeout(() => {
      const titleElement = document.getElementById('offcanvasBottomLabel');
      if (titleElement) {
        titleElement.focus();
      }
    }, 100);
  }
}
