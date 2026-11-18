import { inject, Injectable } from '@angular/core';
import { HarvestField } from '../models/daily-harvest.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DailyHarvestService {
  private apiService = inject(ApiService);
  private readonly API_URL = this.apiService.getLinkWebApp();

  private cachedFields: HarvestField[] | null = null;
  private dailyCache = new Map<string, Record<string, any>>();

  private async postAction<T>(action: string, payload: any): Promise<T> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload })
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'حدث خطأ في الاتصال بالخادم');
    }
    return result.data;
  }

  // إضافة role اختيارياً للتدقيق في الـ Backend إذا لزم الأمر
  async getDailyHarvest(date: string, userId: string, role: string = '', forceRefresh = false) {
    const cacheKey = `${userId}_${date}`;

    if (!forceRefresh && this.cachedFields && this.dailyCache.has(cacheKey)) {
      return {
        record: this.dailyCache.get(cacheKey)!,
        fields: this.cachedFields
      };
    }

    const data = await this.postAction<{ record: Record<string, any>; fields: HarvestField[] }>(
      'getDailyHarvest',
      { date, userId, role }
    );

    this.cachedFields = data.fields;
    this.dailyCache.set(cacheKey, data.record);
    return data;
  }

  async getWeeklyHarvest(userId: string, startDate: string, endDate: string, role: string = '') {
    return this.postAction<{ rows: Record<string, any>[]; fields: HarvestField[] }>(
      'getWeeklyHarvest',
      { userId, startDate, endDate, role }
    );
  }

  async saveDailyHarvest(payload: {
    date: string;
    userId: string;
    userName: string;
    values: Record<string, any>;
    role: string;
  }) {
    const res = await this.postAction<{ saved: boolean }>('saveDailyHarvest', payload);
    this.dailyCache.set(`${payload.userId}_${payload.date}`, { ...payload.values });
    return res;
  }
}