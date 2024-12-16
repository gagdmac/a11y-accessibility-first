import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';

@Component({
  selector: 'app-accessibility-today',
  templateUrl: './accessibility-today.component.html',
  styleUrls: ['./accessibility-today.component.scss'],
})
export class AccessibilityTodayComponent implements OnInit {
  constructor(private contentfulService: ContentfulService) {}

  blogPosts$: Observable<any> | undefined;

  ngOnInit(): void {
    this.blogPosts$ = this.contentfulService.getEntries();
  }
}
