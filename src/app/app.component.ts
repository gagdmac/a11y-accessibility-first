import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
// import { AnimationService } from './services/animation/animation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'a11y';

  constructor(private router: Router, private renderer: Renderer2) {
    // Listen to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Add overflow hidden when navigation starts
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
        this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
      }
      if (event instanceof NavigationEnd) {
        // Remove overflow hidden after a delay (match this with your animation duration)
        setTimeout(() => {
          this.renderer.removeStyle(document.body, 'overflow');
          this.renderer.removeStyle(document.documentElement, 'overflow');
        }, 800); // 800ms = animation duration
      }
    });
  }
  // private animationService: AnimationService

  ngOnInit() {}
}
