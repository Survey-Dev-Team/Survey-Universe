import { ChartTheme } from '../models/interfaces';

export function getChartTheme(): ChartTheme {
  const s = getComputedStyle(document.body);
  return {
    textColor:    s.getPropertyValue('--chart-text-color').trim(),
    gridColor:    s.getPropertyValue('--chart-grid-color').trim(),
    accent:       s.getPropertyValue('--chart-accent').trim(),
    accentAlpha:  s.getPropertyValue('--chart-accent-alpha').trim(),
    success:      s.getPropertyValue('--chart-success').trim(),
    successAlpha: s.getPropertyValue('--chart-success-alpha').trim(),
    danger:       s.getPropertyValue('--chart-danger').trim(),
    orange:       s.getPropertyValue('--chart-orange').trim(),
    yellow:       s.getPropertyValue('--chart-yellow').trim(),
    cyan:         s.getPropertyValue('--chart-cyan').trim(),
    teal:         s.getPropertyValue('--chart-teal').trim(),
    amber:        s.getPropertyValue('--chart-amber').trim(),
    pass:         s.getPropertyValue('--chart-pass').trim(),
    fail:         s.getPropertyValue('--chart-fail').trim(),
    accentBar:    s.getPropertyValue('--chart-accent-bar').trim(),
  };
}
