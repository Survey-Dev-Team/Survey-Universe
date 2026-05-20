import { TableColumn, TableColumnType } from '../../shared/components/table/table';
import { ROUTES } from '../../shared/models/routes.constants';

export const ADMIN_SURVEYS_COLUMNS: TableColumn[] = [
  { header: '',          field: 'coverImage',    type: TableColumnType.Image                                       },
  { header: 'Title',     field: 'title',         type: TableColumnType.Link,  basePath: `/${ROUTES.SURVEYS}`       },
  { header: 'Category',  field: 'category',      type: TableColumnType.CategoryBadge                              },
  { header: 'Author',    field: 'author'                                                                           },
  { header: 'Questions', field: 'questionCount', type: TableColumnType.Number                                     },
  { header: 'Responses', field: 'responses',     type: TableColumnType.Number                                     },
  { header: 'Status',    field: 'status',        type: TableColumnType.Badge                                      },
  { header: 'Published', field: 'published',     type: TableColumnType.Toggle                                     },
  { header: 'Created',   field: 'createdAt'                                                                        },
  { header: 'Actions',   field: 'id',            type: TableColumnType.Actions                                    },
];
