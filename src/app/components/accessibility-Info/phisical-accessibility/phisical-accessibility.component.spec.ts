import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhisicalAccessibilityComponent } from './phisical-accessibility.component';

describe('PhisicalAccessibilityComponent', () => {
  let component: PhisicalAccessibilityComponent;
  let fixture: ComponentFixture<PhisicalAccessibilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhisicalAccessibilityComponent]
    });
    fixture = TestBed.createComponent(PhisicalAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
