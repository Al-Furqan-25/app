import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YDailyHarvest } from './y-daily-harvest';

describe('YDailyHarvest', () => {
  let component: YDailyHarvest;
  let fixture: ComponentFixture<YDailyHarvest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YDailyHarvest],
    }).compileComponents();

    fixture = TestBed.createComponent(YDailyHarvest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
