import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EDailyHarvest } from './e-daily-harvest';

describe('EDailyHarvest', () => {
  let component: EDailyHarvest;
  let fixture: ComponentFixture<EDailyHarvest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EDailyHarvest],
    }).compileComponents();

    fixture = TestBed.createComponent(EDailyHarvest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
