import { NgModule } from '@angular/core';
import { ThemeService } from './themes-color/theme.service';
import { FontSizeService } from './font-size/font-size.service';
import { LinkHighlightService } from './links-hightligh/links-highlight.service';
import { AnimationService } from './animation/animation.service';

@NgModule({
  providers: [
    ThemeService,
    FontSizeService,
    LinkHighlightService,
    AnimationService,
  ],
})
export class ServicesModule {}
