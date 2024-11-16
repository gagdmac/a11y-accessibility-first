import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibleHealthcareComponent } from './accessible-healthcare.component';

describe('AccessibleHealthcareComponent', () => {
  let component: AccessibleHealthcareComponent;
  let fixture: ComponentFixture<AccessibleHealthcareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessibleHealthcareComponent]
    });
    fixture = TestBed.createComponent(AccessibleHealthcareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
