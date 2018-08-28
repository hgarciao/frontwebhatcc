import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryUnfvComponent } from './registry-unfv.component';

describe('RegistryUnfvComponent', () => {
  let component: RegistryUnfvComponent;
  let fixture: ComponentFixture<RegistryUnfvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryUnfvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryUnfvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
