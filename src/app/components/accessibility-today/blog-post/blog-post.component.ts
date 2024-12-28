import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router import
import { Observable, Subscription, Subject } from 'rxjs';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { SocialShareService } from '../../../services/social-share/social-share.service';
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

interface BlogPost {
  fields: {
    title: string;
    author: string;
    content: any;
    summary: string;
    imageAlt: string;
    featureImage: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    img: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };
  sys: {
    id: string;
  };
}

interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
}

interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit, OnDestroy {
  blogPost$: Observable<BlogPost> | undefined;
  currentBlogPost: BlogPost | null = null;
  private destroy$ = new Subject<void>();
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private metaTagService: MetaTagService,
    private route: ActivatedRoute,
    private router: Router, // Add router to constructor
    private contentfulService: ContentfulService,
    private translateService: TranslateService,
    private location: Location,
    private socialShareService: SocialShareService
  ) {}

  share(platform: 'facebook' | 'twitter' | 'linkedin') {
    if (!this.currentBlogPost) return;

    const currentUrl = window.location.href;
    const title = this.currentBlogPost.fields.title;
    const summary = this.currentBlogPost.fields.summary;

    this.socialShareService.shareToSocial(platform, currentUrl, title, summary);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loadBlogPost();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadBlogPost();
        this.loadBreadcrumbs();
      });
    this.setBreadcrumbs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlogPost() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.blogPost$ = this.contentfulService.getEntry<BlogPost>(postId);
      this.blogPost$.pipe(takeUntil(this.destroy$)).subscribe((post) => {
        this.currentBlogPost = post;
        this.loadBreadcrumbs(); // Update breadcrumbs after post loads
      });
    }
  }

  async loadBreadcrumbs() {
    try {
      // Get base breadcrumbs
      this.breadcrumbs = await this.contentfulService.getBreadcrumbs('/blog');

      // Add current blog post to breadcrumbs if available
      if (this.currentBlogPost) {
        this.breadcrumbs.push({
          label: this.currentBlogPost.fields.title,
          url: this.router.url,
          isActive: true,
        });
      }
    } catch (error) {
      console.error('Error loading breadcrumbs:', error);
      this.breadcrumbs = [
        {
          label: 'Home',
          url: '/',
          isActive: false,
        },
        {
          label: 'Blog',
          url: '/blog',
          isActive: false,
        },
      ];
    }
  }

  setBreadcrumbs() {
    this.breadcrumbs = [
      { label: 'Home', url: '/', isActive: false },
      {
        label: 'Accessibility Today',
        url: '/accessibility-today',
        isActive: false,
      },
    ];
  }

  richTextToHtml(richText: any): string {
    return documentToHtmlString(richText);
  }

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Web Accessibility',
      description:
        'Learn about web accessibility standards and best practices for creating inclusive digital experiences.',
      keywords: 'web accessibility, WCAG, digital inclusion, accessible design',
      ogTitle: 'Web Accessibility - A11Y',
      ogDescription:
        'Learn about web accessibility standards and best practices for creating inclusive digital experiences.',
      twitterCard: 'summary',
    });
  }
}
