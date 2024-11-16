import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalDesignComponent } from './universal-design.component';

describe('UniversalDesignComponent', () => {
  let component: UniversalDesignComponent;
  let fixture: ComponentFixture<UniversalDesignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversalDesignComponent]
    });
    fixture = TestBed.createComponent(UniversalDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
