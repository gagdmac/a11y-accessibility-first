import { Component, OnInit } from '@angular/core';

// import { ThemeService } from './services/theme.service';
// import { FontSizeService } from './services/font-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'a11y';

  constructor() {}

  ngOnInit(): void {}
}
