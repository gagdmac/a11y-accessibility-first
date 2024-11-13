import { Component, OnInit } from '@angular/core';
// import { AnimationService } from './services/animation/animation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'a11y';

  constructor() {}
  // private animationService: AnimationService

  ngOnInit() {
    // this.animationService.initAOS();
  }
}
