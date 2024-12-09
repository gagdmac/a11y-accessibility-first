import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Empty404Component } from './empty-404.component';

describe('Empty404Component', () => {
  let component: Empty404Component;
  let fixture: ComponentFixture<Empty404Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Empty404Component]
    });
    fixture = TestBed.createComponent(Empty404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
