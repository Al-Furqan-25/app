import { inject, Injectable } from '@angular/core';
import { HarvestField } from '../models/daily-harvest.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DailyHarvestService {
  private apiService = inject(ApiService);

  // ضعي رابط نشر Web App الخاص بكِ هنا
  private readonly API_URL = this.apiService.getLinkWebApp();

  private cachedFields: HarvestField[] | null = null;
  private dailyCache = new Map<string, Record<string, any>>();

  private async postAction<T>(action: string, payload: any): Promise<T> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // يمنع طلبات Preflight OPTIONS المبطئة في GAS
      body: JSON.stringify({ action, payload })
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'حدث خطأ في الاتصال بالخادم');
    }
    return result.data;
  }

  async getDailyHarvest(date: string, teacherId: string, forceRefresh = false) {
    const cacheKey = `${teacherId}_${date}`;

    // إذا كانت البيانات محفوظة مسبقاً في الجلسة الحالية، نعيدها فوراً بدون انتظار الشبكة
    if (!forceRefresh && this.cachedFields && this.dailyCache.has(cacheKey)) {
      return {
        record: this.dailyCache.get(cacheKey)!,
        fields: this.cachedFields
      };
    }

    const data = await this.postAction<{ record: Record<string, any>; fields: HarvestField[] }>(
      'getDailyHarvest',
      { date, teacherId }
    );

    this.cachedFields = data.fields;
    this.dailyCache.set(cacheKey, data.record);
    return data;
  }

  async getWeeklyHarvest(teacherId: string, startDate: string, endDate: string) {
    return this.postAction<{ rows: Record<string, any>[]; fields: HarvestField[] }>(
      'getWeeklyHarvest',
      { teacherId, startDate, endDate }
    );
  }

  async saveDailyHarvest(payload: {
    date: string;
    teacherId: string;
    teacherName: string;
    values: Record<string, any>;
  }) {
    const res = await this.postAction<{ saved: boolean }>('saveDailyHarvest', payload);
    // تحديث الكاش المحلي فوراً بعد الحفظ
    this.dailyCache.set(`${payload.teacherId}_${payload.date}`, { ...payload.values });
    return res;
  }
}