import ContactStack from '@/Components/Contacts/ContactStack';
import RelationshipTags from '@/Components/RelationshipTags';
import RELATIONSHIPS from '@/constants/relationships';
import useFilters from '@/hooks/useFilters';
import { useWindow } from '@/hooks/useWindow';
import { PageProps } from '@/types';
import { ContactProps } from '@/types/contact';
import { formatPhoneNumber } from '@/utils/formatHelper';
import { paginate } from '@/utils/paginationHelper';
import { Call02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import { JSX, useState } from 'react';
import ContactsActions from './ContactsActions';

function ContactsTable({ contacts }: { contacts: PageProps }) {

  const { breakpoint } = useWindow()
  const { filters } = useFilters('contacts.index')
  const [ paginationLoading, setPaginationLoading ] = useState(false);

  const columns: TableProps['columns'] = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
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
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => (<div className="line-clamp-2">{text}</div>),
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true,
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
      filters: RELATIONSHIPS.map(rel => ({ text: rel.label, value: rel.value })),
      filteredValue: filters?.relationship?.length > 0 ? filters.relationship : null,
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (value, record) => {
        return (
          <RelationshipTags key={record.id} contact={record as ContactProps} />
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
        setPaginationLoading(true);
        const removeListener = router.on('finish', () => {
          setPaginationLoading(false);
          removeListener();
        });

        paginate({
          routeName: 'contacts.index',
          pagination,
          filters,
          sorter,
        })
      }}
      loading={paginationLoading}
    />
  )
}

export { ContactsTable as default };
