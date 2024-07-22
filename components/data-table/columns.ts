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

export const poolColumns: QTableProps['columns'] = [
  { name: 'status', required: true, label: 'Status', align: 'left', field: 'status' },
  { name: 'name', align: 'left', label: 'Name', field: 'name' },
  { name: 'host', align: 'left', label: 'Host', field: 'host' },
  { name: 'admin', align: 'left', label: 'Admin', field: 'admin' },
  { name: 'entries', align: 'left', label: 'Entries', field: 'entries' },
  { name: 'donations', align: 'left', label: 'Donations', field: 'donations' },
  { name: 'numberOfWinners', align: 'left', label: '# Winners', field: 'numberOfWinners' },
  { name: 'openDate', align: 'left', label: 'Opens', field: 'openDate' },
  { name: 'closeDate', align: 'left', label: 'Closes', field: 'closeDate' },
]
