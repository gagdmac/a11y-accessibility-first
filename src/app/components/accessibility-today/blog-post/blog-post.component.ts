import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router import
import { Observable, Subscription, Subject, from } from 'rxjs';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { TranslateService } from '@ngx-translate/core';
import { map, takeUntil } from 'rxjs/operators';
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

  share(platform: 'facebook' | 'linkedin') {
    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.currentBlogPost?.fields?.title || '');

    try {
      let shareUrl = '';
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
          break;
        case 'linkedin':
          // Updated LinkedIn sharing URL format
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${title}`;
          break;
      }

      // Open in a new window with specific dimensions
      const width = 600;
      const height = 400;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        shareUrl,
        'share',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
    this.route.params.subscribe((params) => {
      const urlHandle = params['urlHandle'];
      if (urlHandle) {
        from(this.contentfulService.getBlogPostByHandle(urlHandle))
          .pipe(map((response: { items: any[] }) => response.items[0]))
          .subscribe({
            next: (post) => {
              if (!post) {
                this.router.navigate(['/404']);
                return;
              }
              this.blogPost$ = from(Promise.resolve(post));
            },
            error: () => {
              this.router.navigate(['/404']);
            },
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlogPost() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.contentfulService
        .getEntry<BlogPost>(postId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (post) => {
            if (!post) {
              this.router.navigate(['/404']);
              return;
            }
            this.currentBlogPost = post;
            this.blogPost$ = from(Promise.resolve(post));
            this.loadBreadcrumbs();
          },
          error: () => {
            this.router.navigate(['/404']);
          },
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
