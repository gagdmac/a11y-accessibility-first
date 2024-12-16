import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A11yOptionsComponent } from './a11y-options.component';

describe('A11yOptionsComponent', () => {
  let component: A11yOptionsComponent;
  let fixture: ComponentFixture<A11yOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [A11yOptionsComponent]
    });
    fixture = TestBed.createComponent(A11yOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
