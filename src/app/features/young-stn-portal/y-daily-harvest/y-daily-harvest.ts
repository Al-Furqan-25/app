import { Component } from '@angular/core';
import { AppRoles } from '../../../core/constants/app-roles';
import { BaseDailyHarvest } from '../../../shared/components/base-daily-harvest/base-daily-harvest';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, BaseDailyHarvest],
  selector: 'app-y-daily-harvest',
  styleUrl: './y-daily-harvest.scss',
  templateUrl: './y-daily-harvest.html',
})
export class YDailyHarvest {
  public role:string = AppRoles.YOUNG_STN;
  public pageTitle:string = 'معسكر همة';
}
