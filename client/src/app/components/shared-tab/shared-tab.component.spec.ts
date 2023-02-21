import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTabComponent } from './shared-tab.component';

describe('SharedTabComponent', () => {
  let component: SharedTabComponent;
  let fixture: ComponentFixture<SharedTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
