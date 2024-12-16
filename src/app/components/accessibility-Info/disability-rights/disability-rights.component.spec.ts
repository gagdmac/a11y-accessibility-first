import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityRightsComponent } from './disability-rights.component';

describe('DisabilityRightsComponent', () => {
  let component: DisabilityRightsComponent;
  let fixture: ComponentFixture<DisabilityRightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisabilityRightsComponent]
    });
    fixture = TestBed.createComponent(DisabilityRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
