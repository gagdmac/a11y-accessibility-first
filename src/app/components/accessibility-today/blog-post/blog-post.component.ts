import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

interface BlogPost {
  fields: {
    title: string;
    author: string;
    content: any;
    featureImage: {
      fields: {
        file: { url: string };
        title: string;
      };
    };
    authorImage?: {
      fields: {
        file: { url: string };
        title: string;
      };
    };
  };
}

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit, OnDestroy {
  blogPost$: Observable<BlogPost> | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private contentfulService: ContentfulService,
    private translateService: TranslateService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loadBlogPost();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadBlogPost();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlogPost() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.blogPost$ = this.contentfulService.getEntry<BlogPost>(postId);
    }
  }

  richTextToHtml(richText: any): string {
    return documentToHtmlString(richText);
  }
}
