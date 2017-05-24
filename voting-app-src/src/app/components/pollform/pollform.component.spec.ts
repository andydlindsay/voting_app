import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollformComponent } from './pollform.component';

describe('PollformComponent', () => {
  let component: PollformComponent;
  let fixture: ComponentFixture<PollformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
