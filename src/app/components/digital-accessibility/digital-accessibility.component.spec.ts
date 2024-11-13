import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalAccessibilityComponent } from './digital-accessibility.component';

describe('DigitalAccessibilityComponent', () => {
  let component: DigitalAccessibilityComponent;
  let fixture: ComponentFixture<DigitalAccessibilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalAccessibilityComponent]
    });
    fixture = TestBed.createComponent(DigitalAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
