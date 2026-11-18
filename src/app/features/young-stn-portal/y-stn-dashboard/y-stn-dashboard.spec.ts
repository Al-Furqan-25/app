import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YStnDashboard } from './y-stn-dashboard';

describe('YStnDashboard', () => {
  let component: YStnDashboard;
  let fixture: ComponentFixture<YStnDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YStnDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(YStnDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
