import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentComponent } from './menu-content.component';

describe('MenuContentComponent', () => {
  let component: MenuContentComponent;
  let fixture: ComponentFixture<MenuContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuContentComponent]
    });
    fixture = TestBed.createComponent(MenuContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
