export type SurveyElementType =
  | 'input'
  | 'textarea'
  | 'select-radio'
  | 'select'
  | 'text'
  | 'title'
  | 'image'
  | 'range'
  | 'paginator'
  | 'space'
  | 'file'
  | 'date-picker';

export type InputSubType = 'text' | 'email' | 'number' | 'tel' | 'url' | 'date';

export interface SurveyElement {
  id: string;
  type: SurveyElementType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  inputSubType?: InputSubType;
  options?: string[];
  imageUrl?: string;
  rangeMin?: number;
  rangeMax?: number;
  rangeStep?: number;
  content?: string;
}

export interface SurveyElementPalette {
  type: SurveyElementType;
  label: string;
  icon: string;
}

export const SURVEY_PALETTE: SurveyElementPalette[] = [
  { type: 'input',        label: 'Input',         icon: 'pi pi-pencil' },
  { type: 'textarea',     label: 'Text Area',      icon: 'pi pi-align-left' },
  { type: 'select-radio', label: 'Radio Select',   icon: 'pi pi-list' },
  { type: 'select',       label: 'Select',         icon: 'pi pi-chevron-down' },
  { type: 'text',         label: 'Text',           icon: 'pi pi-file-word' },
  { type: 'title',        label: 'Title',          icon: 'pi pi-bold' },
  { type: 'image',        label: 'Image',          icon: 'pi pi-image' },
  { type: 'range',        label: 'Range',          icon: 'pi pi-sliders-h' },
  { type: 'paginator',    label: 'Page Break',     icon: 'pi pi-pause' },
  { type: 'space',        label: 'Space',          icon: 'pi pi-minus' },
  { type: 'file',         label: 'File Upload',    icon: 'pi pi-upload' },
  { type: 'date-picker',  label: 'Date Picker',    icon: 'pi pi-calendar' },
];

export const INPUT_SUB_TYPES: { label: string; value: InputSubType }[] = [
  { label: 'Text',   value: 'text' },
  { label: 'Email',  value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Phone',  value: 'tel' },
  { label: 'URL',    value: 'url' },
  { label: 'Date',   value: 'date' },
];
