import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsUnfv2Component } from './posts-unfv2.component';

describe('PostsUnfv2Component', () => {
  let component: PostsUnfv2Component;
  let fixture: ComponentFixture<PostsUnfv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsUnfv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsUnfv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
