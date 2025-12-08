import { useWindow } from '@/hooks/useWindow';
import { PageProps } from '@/types';
import { formatCurrency } from '@/utils/formatter';
import { keyToTitle } from '@/utils/stringHelper';
import { ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Image, Table } from 'antd';

function ArtworksTable({ artworks }: { artworks: PageProps }) {

  const { breakpoint } = useWindow()

  const columns: TableProps['columns'] = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: (a, b) => a.sku.localeCompare(b.sku),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => text,
      width: 100,
      fixed: breakpoint == 'xs' ? undefined : 'left',
    },
    {
      title: 'Preview',
      key: 'image',
      render: (_, record) => (
        <Image
          src={record.main_image_thumb_url}
          alt={record.title}
          width={70}
          preview={{
            mask: <HugeiconsIcon icon={ViewIcon} />,
            src: record.main_image_url,
          }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => text,
      // width: 250,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => keyToTitle(text),
      // width: 250,
    },
    {
      title: 'Medium',
      dataIndex: 'medium',
      key: 'medium',
      sorter: (a, b) => a.medium.localeCompare(b.medium),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => text,
      // width: 250,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => formatCurrency(text, 0),
      // width: 250,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => keyToTitle(text),
      // width: 250,
    },
    {
      title: 'Actions',
      key: 'actions',
      // render: (_, record) => (<ContactsActions contact={record as ContactProps} />),
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
      width: 100,
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={artworks.data}
      size='small'
      scroll={{ x: 'max-content' }}
      pagination={{
        current: artworks.current_page,
        total: artworks.total,
        pageSize: artworks.per_page,
        showSizeChanger: true,
      }}
      onChange={(pagination, filters, sorter: any) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('sort_by', typeof sorter.field === 'string' ? sorter.field : String(sorter.field ?? ''));
        urlParams.set('sort_order', sorter.order === 'ascend' ? 'asc' : 'desc');
        urlParams.set('page', String(pagination.current));
        urlParams.set('per_page', String(pagination.pageSize));

        router.get(
          route('artworks.index'),
          Object.fromEntries(urlParams.entries()),
          { preserveScroll: true, preserveState: true }
        );
      }}
    />
  )
}

export { ArtworksTable as default };
