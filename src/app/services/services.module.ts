import { NgModule } from '@angular/core';
import { ThemeService } from './themes-color/theme.service';
import { FontSizeService } from './font-size/font-size.service';
import { LinkHighlightService } from './links-hightligh/links-highlight.service';
import { MetaTagService } from './MetaTag/meta-tag.service';
import { ContentfulService } from './contentful/contentful.service';

@NgModule({
  providers: [
    ThemeService,
    FontSizeService,
    LinkHighlightService,
    MetaTagService,
    ContentfulService,
  ],
})
export class ServicesModule {}
