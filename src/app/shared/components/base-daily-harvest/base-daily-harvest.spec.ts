import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseDailyHarvest } from './base-daily-harvest';

describe('BaseDailyHarvest', () => {
  let component: BaseDailyHarvest;
  let fixture: ComponentFixture<BaseDailyHarvest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDailyHarvest],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseDailyHarvest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
