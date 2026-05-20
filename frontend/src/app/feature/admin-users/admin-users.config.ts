import { TableColumn, TableColumnType as ColType } from '../../shared/components/table/table';
import { ROUTES } from '../../shared/models/routes.constants';

export const USER_COLUMNS: TableColumn[] = [
  { header: '',             field: 'name',        type: ColType.Avatar                             },
  { header: 'User',         field: 'name',        type: ColType.UserInfo,  secondaryField: 'email' },
  { header: 'Role',         field: 'role',        type: ColType.RoleBadge                          },
  { header: 'Surveys',      field: 'surveysCount', type: ColType.Number                             },
  { header: 'Tests',        field: 'testsCount',   type: ColType.Number                             },
  { header: 'Created',      field: 'createdAt',   type: ColType.Date                               },
  { header: 'Last session', field: 'lastSession', type: ColType.Date                               },
  { header: '',             field: 'id',          type: ColType.Delete                             },
];

export const USER_SURVEYS_COLUMNS: TableColumn[] = [
  { header: 'Survey',       field: 'title',          type: ColType.Link,         basePath: '/' + ROUTES.SURVEYS },
  { header: 'Category',     field: 'category',       type: ColType.CategoryBadge                                },
  { header: 'Completion',   field: 'completionRate', type: ColType.Progress                                     },
  { header: 'Completed on', field: 'completedAt',    type: ColType.Date                                         },
];

export const USER_TESTS_COLUMNS: TableColumn[] = [
  { header: 'Test',         field: 'title',          type: ColType.Link,         basePath: '/' + ROUTES.SURVEYS },
  { header: 'Category',     field: 'category',       type: ColType.CategoryBadge                                },
  { header: 'Score',        field: 'score',          type: ColType.Score                                        },
  { header: 'Result',       field: 'result',         type: ColType.Badge                                        },
  { header: 'Completion',   field: 'completionRate', type: ColType.Progress                                     },
  { header: 'Completed on', field: 'completedAt',    type: ColType.Date                                         },
];
