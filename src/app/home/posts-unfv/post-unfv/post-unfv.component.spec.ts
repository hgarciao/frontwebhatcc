import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUnfvComponent } from './post-unfv.component';

describe('PostUnfvComponent', () => {
  let component: PostUnfvComponent;
  let fixture: ComponentFixture<PostUnfvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostUnfvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUnfvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
