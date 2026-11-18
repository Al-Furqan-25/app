import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDailyHarvest } from '../../../shared/components/base-daily-harvest/base-daily-harvest';
import { AppRoles } from '../../../core/constants/app-roles';

@Component({
  imports: [CommonModule, BaseDailyHarvest],
  selector: 'app-daily-harvest',
  styleUrl: './daily-harvest.scss',
  templateUrl: './daily-harvest.html',
})
export class DailyHarvest {
  public role:string = AppRoles.TEACHER;
  public pageTitle:string = 'معسكر همة';
}
