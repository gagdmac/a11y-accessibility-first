import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityTodayComponent } from './accessibility-today.component';

describe('AccessibilityTodayComponent', () => {
  let component: AccessibilityTodayComponent;
  let fixture: ComponentFixture<AccessibilityTodayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessibilityTodayComponent]
    });
    fixture = TestBed.createComponent(AccessibilityTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
