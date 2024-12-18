import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit, OnDestroy {
  blogPost$: Observable<any> | undefined;
  private langSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private contentfulService: ContentfulService,
    private translate: TranslateService
  ) {
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      console.log('Language changed in blog-post component');
      this.refreshContent();
    });
  }

  ngOnInit(): void {
    this.refreshContent();
  }

  refreshContent() {
    const postId = this.route.snapshot.paramMap.get('id');
    console.log('Refreshing content for post:', postId);
    if (postId) {
      this.blogPost$ = this.contentfulService.getEntry(postId);
    }
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  richTextToHtml(richText: any): string {
    return documentToHtmlString(richText);
  }
}
