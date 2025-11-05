import ContactStack from '@/Components/ContactStack';
import RelationshipTags from '@/Components/RelationshipTags';
import { useWindow } from '@/hooks/useWindow';
import { PageProps } from '@/types';
import { ContactProps } from '@/types/contact';
import { formatPhoneNumber } from '@/utils/formatter';
import { Call02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import ContactsActions from './ContactsActions';

function ContactsTable({ contacts }: { contacts: PageProps }) {

  const { breakpoint } = useWindow()

  const columns: TableProps['columns'] = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text, record): JSX.Element => (<ContactStack contact={record as ContactProps} />),
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
          <div className='flex items-center gap-1'>
            <HugeiconsIcon icon={Call02Icon} strokeWidth={1} size={20} />
            {formatPhoneNumber(text)}
          </div>
        )
      },
      width: 180,
    },
    {
      title: 'Relationship',
      dataIndex: 'relationship',
      key: 'relationship',
      filters: [
        { text: 'Artist', value: 'artist' },
        { text: 'Vendor', value: 'vendor' },
        { text: 'Collector', value: 'collector' },
        { text: 'Other', value: 'other' },
      ],
      sorter: (a, b) => a.relationship.localeCompare(b.relationship),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false, 
      render: (value, record) => {
        return (
          <RelationshipTags key={record.id} contact={record as ContactProps} manageButtonDelay={500} />
        )
      },
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (<ContactsActions contact={record as ContactProps} />),
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
      width: 100,
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={contacts.data}
      size='small'
      scroll={{ x: 'max-content' }}
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
        if (filters.relationship) {
          urlParams.set('relationship', String(filters.relationship));
        } else {
          urlParams.delete('relationship');
        }

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
