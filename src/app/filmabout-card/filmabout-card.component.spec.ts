import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmaboutCardComponent } from './filmabout-card.component';

describe('FilmaboutCardComponent', () => {
  let component: FilmaboutCardComponent;
  let fixture: ComponentFixture<FilmaboutCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilmaboutCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmaboutCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
