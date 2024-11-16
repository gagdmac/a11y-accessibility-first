import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDisplayComponent } from './content-display.component';

describe('ContentDisplayComponent', () => {
  let component: ContentDisplayComponent;
  let fixture: ComponentFixture<ContentDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentDisplayComponent]
    });
    fixture = TestBed.createComponent(ContentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
