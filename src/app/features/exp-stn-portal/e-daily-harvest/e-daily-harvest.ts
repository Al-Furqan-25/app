import { Component } from '@angular/core';
import { AppRoles } from '../../../core/constants/app-roles';
import { BaseDailyHarvest } from '../../../shared/components/base-daily-harvest/base-daily-harvest';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, BaseDailyHarvest],
  selector: 'app-e-daily-harvest',
  styleUrl: './e-daily-harvest.scss',
  templateUrl: './e-daily-harvest.html',
})
export class EDailyHarvest {
  public role:string = AppRoles.EXP_STN;
  public pageTitle:string = 'معسكر همة';
}
