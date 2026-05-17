export enum DishType {
  APPETIZER = 'APPETIZER',
  MAIN_COURSE = 'MAIN_COURSE',
  DESSERT = 'DESSERT',
}

export enum DishState {
  AVAILABLE = 'Available',
  ON_STOP = 'On stop',
}

export type ToastSeverityType = 'success' | 'error' | 'info' | 'warn';


export type DatePickerSelectionMode =
  | 'single'
  | 'multiple'
  | 'range'
  | undefined;
