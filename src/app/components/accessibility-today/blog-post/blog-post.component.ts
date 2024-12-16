import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private contentfulService: ContentfulService
  ) {}

  blogPost$: Observable<any> | undefined;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.blogPost$ = this.contentfulService.getEntry(id);
    });
  }

  richTextToHtml(richText: any): string {
    return documentToHtmlString(richText);
  }
}
