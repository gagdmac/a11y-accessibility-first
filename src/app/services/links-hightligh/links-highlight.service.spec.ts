import { TestBed } from '@angular/core/testing';

import { LinkHighlightService } from './links-highlight.service';

describe('LinksHighlightService', () => {
  let service: LinkHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkHighlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
