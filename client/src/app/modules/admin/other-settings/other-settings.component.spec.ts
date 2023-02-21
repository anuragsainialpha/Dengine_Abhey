import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSettingsComponent } from './other-settings.component';

describe('OtherSettingsComponent', () => {
  let component: OtherSettingsComponent;
  let fixture: ComponentFixture<OtherSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
