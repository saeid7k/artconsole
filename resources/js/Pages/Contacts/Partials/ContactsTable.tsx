import ContactStack from '@/Components/ContactStack';
import { useBreakpoints } from '@/hooks/useBreakPoints';
import { PageProps } from '@/types';
import { Contact } from '@/types/contact';
import { formatPhoneNumber } from '@/utils/formatter';
import { Call02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Table } from 'antd';

function ContactsTable({ contacts }: { contacts: PageProps }) {

  const breakPoint = useBreakpoints()

  const columns: TableProps['columns'] = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record): JSX.Element => (<ContactStack contact={record as Contact} />),
      width: 200,
      fixed: breakPoint == 'xs' ? undefined : 'left',
    },
    {
      title: 'Address',
      dataIndex: 'formatted_address',
      key: 'formatted_address',
      sorter: (a, b) => a.formatted_address.localeCompare(b.formatted_address),
      sortDirections: ['ascend', 'descend'],
      render: (text) => (<div className="line-clamp-2">{text}</div>),
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      sortDirections: ['ascend', 'descend'],
      render: (text) => {
        return (
          <div className='flex items-center gap-1'>
            <HugeiconsIcon icon={Call02Icon} strokeWidth={1} size={20} />
            {formatPhoneNumber(text)}
          </div>
        )
      },
      width: 180,
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={contacts.data}
      scroll={{ x: 'max-content' }}
      size='small'
      pagination={{
        current: contacts.current_page,
        total: contacts.total,
        pageSize: contacts.per_page,
        showSizeChanger: true,
      }}
      onChange={(pagination, filters, sorter: any) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('sort_by', typeof sorter.field === 'string' ? sorter.field : String(sorter.field ?? ''));
        urlParams.set('sort_order', sorter.order === 'ascend' ? 'asc' : 'desc');
        urlParams.set('page', String(pagination.current));
        urlParams.set('per_page', String(pagination.pageSize));

        router.get(
          route('contacts.index'),
          Object.fromEntries(urlParams.entries()),
          { preserveScroll: true, preserveState: true }
        );
      }}
    />
  )
}

export { ContactsTable as default };
