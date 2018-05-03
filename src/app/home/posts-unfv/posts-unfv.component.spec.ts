import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsUnfvComponent } from './posts-unfv.component';

describe('PostsUnfvComponent', () => {
  let component: PostsUnfvComponent;
  let fixture: ComponentFixture<PostsUnfvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsUnfvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsUnfvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
