import { Component, input, output, contentChild, TemplateRef } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { StatStatus } from '../../models/enums';

export enum TableColumnType {
  Text          = 'text',
  Link          = 'link',
  Number        = 'number',
  Progress      = 'progress',
  Badge         = 'badge',
  Score         = 'score',
  Suffix        = 'suffix',
  Image         = 'image',
  CategoryBadge = 'categoryBadge',
  Toggle        = 'toggle',
  Actions       = 'actions',
  // ── User list ──────────────────────────────
  Avatar        = 'avatar',
  UserInfo      = 'userInfo',
  RoleBadge     = 'roleBadge',
  Length        = 'length',
  Delete        = 'delete',
}

export interface TableColumn {
  header: string;
  field: string;
  type?: TableColumnType;
  /** type: Link — base path, e.g. '/surveys' */
  basePath?: string;
  /** type: Link — row field used as the id segment; defaults to 'id' */
  idField?: string;
  /** type: Score — lower bound for "mid" range; default 50 */
  midThreshold?: number;
  /** type: Score — lower bound for "good" range; default 70 */
  goodThreshold?: number;
  /** type: Suffix — static suffix appended after the value, e.g. 'min' */
  suffix?: string;
  /** type: UserInfo — secondary field key rendered below the primary (e.g. 'email') */
  secondaryField?: string;
}

@Component({
  selector: 'gt-table',
  standalone: true,
  imports: [TableModule, DecimalPipe, RouterLink, NgTemplateOutlet],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class GtTable {
  columns               = input<TableColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows                  = input<any[]>([]);
  showPublishAction     = input<boolean>(false);
  expandable            = input<boolean>(false);

  expandedRowTemplate   = contentChild<TemplateRef<unknown>>('expandedRow');

  publishToggle = output<string>();
  editRow       = output<string>();
  deleteRow     = output<string>();
  rowExpand     = output<string>();

  readonly StatStatus = StatStatus;
  readonly ColType    = TableColumnType;

  getInitials(name: string): string {
    return (name as string)
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
