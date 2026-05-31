import UserStack from '@/Components/UserStack';
import { useWindow } from '@/hooks/useWindow';
import { PageProps } from '@/types';
import { UserProps } from '@/types/user';
import { formatPhoneNumber } from '@/utils/formatHelper';
import { Call02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import UsersActions from './UsersActions';
import { JSX } from 'react';

function UsersTable({ users }: { users: PageProps }) {

  const { breakpoint } = useWindow()

  const columns: TableProps['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      width: 30,
      fixed: breakpoint == 'xs' ? undefined : 'left',
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text, record): JSX.Element => (<UserStack user={record as UserProps} />),
      width: 200,
      fixed: breakpoint == 'xs' ? undefined : 'left',
    },
    {
      title: 'Address',
      dataIndex: 'formatted_address',
      key: 'formatted_address',
      sorter: (a, b) => a.formatted_address.localeCompare(b.formatted_address),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => (<div className="line-clamp-2">{text}</div>),
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => {
        return (
          <>
            {text && (
              <div className='flex items-center gap-1'>
                <HugeiconsIcon icon={Call02Icon} strokeWidth={1} size={20} />
                {formatPhoneNumber(text)}
              </div>
            )}
          </>
        )
      },
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (<UsersActions user={record as UserProps} />),
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
      width: 100,
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={users.data}
      rowKey="id"
      size='small'
      scroll={{ x: 'max-content' }}
      pagination={{
        current: users.current_page,
        total: users.total,
        pageSize: users.per_page,
        showSizeChanger: true,
      }}
      onChange={(pagination, filters, sorter: any) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('sort_by', typeof sorter.field === 'string' ? sorter.field : String(sorter.field ?? ''));
        urlParams.set('sort_order', sorter.order === 'ascend' ? 'asc' : 'desc');
        urlParams.set('page', String(pagination.current));
        urlParams.set('per_page', String(pagination.pageSize));
        // if (filters.relationship) {
        //   urlParams.set('relationship', String(filters.relationship));
        // } else {
        //   urlParams.delete('relationship');
        // }

        router.get(
          route('users.index'),
          Object.fromEntries(urlParams.entries()),
          { preserveScroll: true, preserveState: true }
        );
      }}
    />
  )
}

export { UsersTable as default };
