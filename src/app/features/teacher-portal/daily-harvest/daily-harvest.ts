import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyHarvestService } from '../../../core/services/daily-harvest.service';
import { SpinnerService } from '../../../core/services/spinner.service';
import {
  HarvestField,
  HarvestGroup,
  WeeklySummaryGroup,
  WeeklySummaryItem
} from '../../../core/models/daily-harvest.model';
import { HeaderService } from '../../../core/services/header.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-daily-harvest',
  styleUrl: './daily-harvest.scss',
  templateUrl: './daily-harvest.html',
})
export class DailyHarvest implements OnInit{
  private harvestService = inject(DailyHarvestService);
  private spinner = inject(SpinnerService);
  private headerService = inject(HeaderService);

  // بيانات المعلمة من localStorage
  teacherId = localStorage.getItem('USER_ID') || '';
  teacherName = localStorage.getItem('USER_NAME') || 'المعلمة';
  teacherCategory = localStorage.getItem('teacherCategory') || '';

  // حالة الصفحة والتاريخ
  selectedDate = signal<Date>(new Date());
  activeTab = signal<'daily' | 'weekly'>('daily');
  errorMessage = signal<string>('');

  // بيانات التقرير اليومي
  fields = signal<HarvestField[]>([]);
  dailyRecord = signal<Record<string, any>>({});
  hasDailyData = computed(() => Object.keys(this.dailyRecord()).length > 0);

  // تجميع الحقول للعرض وللنموذج
  groupedFields = computed<HarvestGroup[]>(() => {
    const map = new Map<string, HarvestField[]>();
    this.fields().forEach(f => {
      if (!map.has(f.group)) map.set(f.group, []);
      map.get(f.group)!.push(f);
    });

    const result: HarvestGroup[] = [];
    map.forEach((groupFields, groupName) => {
      const firstWithCats = groupFields.find(f => f.categories && f.categories.length > 0);
      const hasCats = !!firstWithCats;
      const isFaraed = hasCats && groupName.includes('فرائض');
      result.push({
        groupName,
        fields: groupFields,
        hasCategoriesTable: hasCats,
        isFaraedTable: isFaraed,
        headers: firstWithCats ? firstWithCats.categories : []
      });
    });
    return result;
  });

  // بيانات التقرير الأسبوعي
  weekStart = signal<string>('');
  weekEnd = signal<string>('');
  weekRangeHint = signal<string>('اختر مجالاً لا يتجاوز سبعة أيام');
  weeklySummary = signal<WeeklySummaryGroup[]>([]);

  // حالة نافذة الإدخال (Modal)
  isEditModalOpen = signal<boolean>(false);
  formValues = signal<Record<string, any>>({});
  expandedAccordionIndex = signal<number>(0);

  // حالة التقويم المخصص (Custom Calendar Modal)
  isCalendarModalOpen = signal<boolean>(false);
  modalSelectedDate = signal<Date>(new Date());
  activeViewMonth = signal<number>(new Date().getMonth());
  activeViewYear = signal<number>(new Date().getFullYear());

  readonly LEVANT_MONTHS = [
    'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
    'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'
  ];
  readonly WEEKDAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  readonly YEARS_LIST = [2025, 2026, 2027, 2028, 2029, 2030];

  // عنوان التاريخ المنسق
  formattedDateTitle = computed(() => {
    return this.selectedDate().toLocaleDateString('ar-SY', {
      calendar: 'gregory',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  modalDateBanner = computed(() => {
    const d = this.modalSelectedDate();
    return `${this.WEEKDAYS_AR[d.getDay()]} , ${d.getDate()} / ${this.LEVANT_MONTHS[d.getMonth()]} / ${d.getFullYear()}`;
  });

  calendarGridCells = computed(() => {
    const year = this.activeViewYear();
    const month = this.activeViewMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay + 1) % 7; // يبدأ من السبت
    const totalDays = new Date(year, month + 1, 0).getDate();

    const cells: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    return cells;
  });

  ngOnInit() {
    this.headerService.setTitle('معسكر همة');
    this.initWeekRange(this.selectedDate());
    this.loadDailyData();
  }

  // --- إدارة التواريخ والتنقل ---
  formatDateISO(date: Date): string {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  previousDate() {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() - 1);
    this.selectedDate.set(d);
    this.refreshCurrentView();
  }

  nextDate() {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() + 1);
    this.selectedDate.set(d);
    this.refreshCurrentView();
  }

  switchTab(tab: 'daily' | 'weekly') {
    this.activeTab.set(tab);
    if (tab === 'weekly' && !this.weekStart()) {
      this.initWeekRange(this.selectedDate());
    }
    this.refreshCurrentView();
  }

  refreshCurrentView() {
    if (this.activeTab() === 'daily') {
      this.loadDailyData();
    } else {
      this.loadWeeklyData();
    }
  }

  // --- تحميل البيانات ---
  async loadDailyData(forceRefresh = false) {
    this.spinner.show();
    this.errorMessage.set('');
    try {
      const dateStr = this.formatDateISO(this.selectedDate());
      const res = await this.harvestService.getDailyHarvest(dateStr, this.teacherId, forceRefresh);
      this.fields.set(res.fields);
      this.dailyRecord.set(res.record || {});
    } catch (err: any) {
      this.errorMessage.set(err.message || 'تعذر تحميل البيانات');
    } finally {
      this.spinner.hide();
    }
  }

  // --- منطق الأسبوع ---
  initWeekRange(baseDate: Date) {
    const d = new Date(baseDate);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 1) % 7));
    const end = new Date(d);
    end.setDate(end.getDate() + 6);

    this.weekStart.set(this.formatDateISO(d));
    this.weekEnd.set(this.formatDateISO(end));
  }

  onWeekStartChange(newStart: string) {
    this.weekStart.set(newStart);
    if (!newStart) return;
    const start = new Date(newStart);
    const maxEnd = new Date(start);
    maxEnd.setDate(maxEnd.getDate() + 6);

    const currentEnd = new Date(this.weekEnd());
    if (isNaN(currentEnd.getTime()) || currentEnd < start || currentEnd > maxEnd) {
      this.weekEnd.set(this.formatDateISO(maxEnd));
    }
  }

  applyWeeklyRange() {
    const start = new Date(this.weekStart());
    const end = new Date(this.weekEnd());
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      this.weekRangeHint.set('يرجى اختيار تاريخ بداية ونهاية صحيحين.');
      return;
    }

    const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    if (days > 7) {
      const maxEnd = new Date(start);
      maxEnd.setDate(maxEnd.getDate() + 6);
      this.weekEnd.set(this.formatDateISO(maxEnd));
      this.weekRangeHint.set('تم ضبط المجال إلى 7 أيام كحد أقصى.');
    } else {
      this.weekRangeHint.set(`تم تحديد ${days} أيام.`);
    }

    this.loadWeeklyData();
  }

  async loadWeeklyData() {
    this.spinner.show();
    this.errorMessage.set('');
    try {
      const res = await this.harvestService.getWeeklyHarvest(
        this.teacherId,
        this.weekStart(),
        this.weekEnd()
      );
      this.fields.set(res.fields);
      this.computeWeeklySummary(res.rows, res.fields);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'تعذر تحميل التقرير الأسبوعي');
    } finally {
      this.spinner.hide();
    }
  }

  private computeWeeklySummary(rows: Record<string, any>[], generalFields: HarvestField[]) {
    if (!rows || rows.length === 0) {
      this.weeklySummary.set([]);
      return;
    }

    const fieldsMap = new Map<string, HarvestField>();
    generalFields.forEach(f => fieldsMap.set(f.name, f));

    const summary: Record<string, WeeklySummaryItem> = {};
    const ignoredKeys = [
      'التاريخ', 'الرقم الفرقاني', 'الاسم', 'درس الحلقة',
      'تحضير الواجب القرآني', 'teacherId', 'date', 'Timestamp', 'تاريخ التحويل', 'النقاط المحتسبة'
    ];
    const specialFields = [
      'غياب عن الدوام هذا اليوم', 'الحضور المبكر', 'النظافة الشخصية',
      'اللباس الشرعي', 'صلاة تحية المسجد', 'درس الحلقة', 'تم إعطاء الدرس'
    ];

    rows.forEach(row => {
      Object.keys(row).forEach(key => {
        if (ignoredKeys.includes(key)) return;
        const val = row[key];
        if (val === undefined || val === '' || val === null) return;

        if (!summary[key]) {
          const isSpecial = specialFields.includes(key);
          summary[key] = {
            name: key,
            days: 0,
            sum: 0,
            label: '',
            isCategory: false,
            isCounter: false,
            breakdown: {},
            allDaysTarget: isSpecial ? (this.teacherCategory === 'يافعات مسار2' ? 3 : 2) : 7
          };
        }

        summary[key].days++;
        const def = fieldsMap.get(key);

        if (def) {
          if (def.categories && def.categories.length > 0) {
            summary[key].isCategory = true;
            summary[key].breakdown[val] = (summary[key].breakdown[val] || 0) + 1;
          } else if (def.type.includes('Counter') || def.type === 'increment') {
            summary[key].isCounter = true;
            summary[key].sum += Number(val) || 0;
            summary[key].label = this.getUnitLabel(def);
          }
        } else if (!isNaN(Number(val)) && val != 1) {
          summary[key].isCounter = true;
          summary[key].sum += Number(val);
          summary[key].label = 'إنجاز';
        }
      });
    });

    const groupsMap = new Map<string, WeeklySummaryItem[]>();
    Object.values(summary).forEach(item => {
      if (item.days === 0) return;
      const gName = fieldsMap.get(item.name)?.group || 'حقول مخصصة';
      if (!groupsMap.has(gName)) groupsMap.set(gName, []);
      groupsMap.get(gName)!.push(item);
    });

    const result: WeeklySummaryGroup[] = [];
    groupsMap.forEach((items, groupName) => result.push({ groupName, items }));
    this.weeklySummary.set(result);
  }

  // --- مساعدات العرض والعدادات ---
  getMultiplier(field: HarvestField): number {
    return field.type === 'pagesCounter' && (field.name.includes('أجزاء') || field.name.includes('سبر'))
      ? 20
      : 1;
  }

  getUnitLabel(field: HarvestField): string {
    if (field.type === 'evenCounter' || field.type === 'oddCounter') return 'ركعات';
    if (
      field.type === 'pagesCounter' ||
      field.group.includes('القرآن') ||
      field.group.includes('الحديث') ||
      field.group.includes('الجزرية') ||
      field.group.includes('تجويد')
    ) {
      return 'صفحة';
    }
    return 'مرات';
  }

  formatDisplayValue(field: HarvestField, rawVal: any): string {
    if (rawVal === '' || rawVal === undefined || rawVal === null) return '—';
    if (field.type === 'checkbox') return rawVal == 1 ? '✓' : '—';
    if (
      Number(rawVal) >= 0 &&
      (field.group.includes('القرآن') ||
        field.group.includes('الحديث') ||
        field.group.includes('الجزرية') ||
        field.group.includes('تجويد'))
    ) {
      return `${rawVal} صفحة`;
    }
    if (field.group.includes('النوافل') || field.group.includes('السنن')) {
      return `${rawVal} ركعة`;
    }
    return String(rawVal);
  }

  // --- إدارة نموذج الإدخال والتعديل ---
  openEditModal() {
    const currentData = this.dailyRecord();
    const initialForm: Record<string, any> = {};

    this.fields().forEach(f => {
      const val = currentData[f.name];
      if (f.type === 'checkbox') {
        initialForm[f.name] = val == 1 ? 1 : '';
      } else if (f.type.includes('Counter') || f.type === 'increment') {
        initialForm[f.name] = val !== undefined && val !== '' ? Number(val) : 0;
      } else {
        initialForm[f.name] = val || '';
      }
    });

    this.formValues.set(initialForm);
    this.expandedAccordionIndex.set(0);
    this.isEditModalOpen.set(true);
  }

  getDisplayCount(field: HarvestField): number {
    const realVal = Number(this.formValues()[field.name]) || 0;
    return realVal / this.getMultiplier(field);
  }

  updateCounter(field: HarvestField, action: 'plus' | 'minus') {
    const mult = this.getMultiplier(field);
    const step = field.type === 'evenCounter' || field.type === 'oddCounter' ? 2 : 1;
    let currentDisplay = this.getDisplayCount(field);

    if (action === 'plus') {
      if (field.type === 'oddCounter' && currentDisplay === 0) currentDisplay = 1;
      else currentDisplay += step;
    } else {
      if (field.type === 'oddCounter' && currentDisplay === 1) currentDisplay = 0;
      else currentDisplay -= step;
    }

    if (currentDisplay < 0) currentDisplay = 0;

    this.formValues.update(prev => ({
      ...prev,
      [field.name]: currentDisplay * mult
    }));
  }

  toggleCheckbox(fieldName: string, checked: boolean) {
    this.formValues.update(prev => ({
      ...prev,
      [fieldName]: checked ? 1 : ''
    }));
  }

  toggleRadio(fieldName: string, value: string) {
    this.formValues.update(prev => ({
      ...prev,
      [fieldName]: prev[fieldName] === value ? '' : value
    }));
  }

  updateTextValue(fieldName: string, value: string) {
    this.formValues.update(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }

  async saveHarvest() {
    this.spinner.show();
    try {
      const dateStr = this.formatDateISO(this.selectedDate());
      await this.harvestService.saveDailyHarvest({
        date: dateStr,
        teacherId: this.teacherId,
        teacherName: this.teacherName,
        values: this.formValues()
      });

      this.isEditModalOpen.set(false);
      await this.loadDailyData(true);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      this.spinner.hide();
    }
  }

  // --- إدارة التقويم المخصص ---
  openCalendarModal() {
    const d = new Date(this.selectedDate());
    this.modalSelectedDate.set(d);
    this.activeViewMonth.set(d.getMonth());
    this.activeViewYear.set(d.getFullYear());
    this.isCalendarModalOpen.set(true);
  }

  changeModalMonth(dir: number) {
    let m = this.activeViewMonth() + dir;
    let y = this.activeViewYear();
    if (m > 11) { m = 0; y++; }
    else if (m < 0) { m = 11; y--; }
    this.activeViewMonth.set(m);
    this.activeViewYear.set(y);
  }

  selectCalendarDay(day: number | null) {
    if (!day) return;
    this.modalSelectedDate.set(new Date(this.activeViewYear(), this.activeViewMonth(), day));
  }

  isSelectedDay(day: number | null): boolean {
    if (!day) return false;
    const sel = this.modalSelectedDate();
    return (
      sel.getDate() === day &&
      sel.getMonth() === this.activeViewMonth() &&
      sel.getFullYear() === this.activeViewYear()
    );
  }

  confirmCalendarDate() {
    this.selectedDate.set(new Date(this.modalSelectedDate()));
    this.isCalendarModalOpen.set(false);
    this.refreshCurrentView();
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  ngOnDestroy() {
    this.headerService.clearTitle();
  }
}
