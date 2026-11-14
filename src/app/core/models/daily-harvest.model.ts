export interface HarvestField {
  group: string;
  name: string;
  type: 'checkbox' | 'evenCounter' | 'oddCounter' | 'increment' | 'pagesCounter' | 'textarea' | string;
  categories: string[];
}

export interface HarvestGroup {
  groupName: string;
  fields: HarvestField[];
  hasCategoriesTable: boolean;
  isFaraedTable: boolean;
  headers: string[];
}

export interface WeeklySummaryItem {
  name: string;
  days: number;
  sum: number;
  label: string;
  isCategory: boolean;
  isCounter: boolean;
  breakdown: { [key: string]: number };
  allDaysTarget: number;
}

export interface WeeklySummaryGroup {
  groupName: string;
  items: WeeklySummaryItem[];
}