import type { QTableProps } from 'quasar'
import { formatRole } from '~/utils/formatter/role'

// TODO: make a formatting function that always applies align left to array
export const hostClubManagementColumns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Role',
    align: 'left',
    field: 'role',
    sortable: true,
    format: v => formatRole(v),
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true,
  },
  { name: 'actions', label: '', field: 'actions' },
]
