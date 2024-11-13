import { NgModule } from '@angular/core';
import { ThemeService } from './themes-color/theme.service';
import { FontSizeService } from './font-size/font-size.service';
import { LinkHighlightService } from './links-hightligh/links-highlight.service';

@NgModule({
  providers: [ThemeService, FontSizeService, LinkHighlightService],
})
export class ServicesModule {}
