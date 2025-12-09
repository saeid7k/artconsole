import ArtworkSpecificationsStack from '@/Components/ArtworkSpecificationsStack';
import ArtworkStatusTag from '@/Components/ArtworkStatusTag';
import ArtworkTitleStack from '@/Components/ArtworkTitleStack';
import LocationStack from '@/Components/LocationStack';
import ARTWORK_CATEGORIES from '@/constants/artworkCategories';
import { useWindow } from '@/hooks/useWindow';
import { PageProps } from '@/types';
import { ArtworkProps } from '@/types/artwork';
import { formatCurrency } from '@/utils/formatter';
import { keyToTitle } from '@/utils/stringHelper';
import { ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Image, Table } from 'antd';
import ArtworksActions from './ArtworksActions';
import ARTWORK_STATUSES from '@/constants/artworkStatuses';

type LocationsProps = Array<{
  id: number;
  name: string;
}>;

function ArtworksTable({ artworks, locations }: { artworks: PageProps, locations: LocationsProps }) {

  const { breakpoint } = useWindow()

  const columns: TableProps['columns'] = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: (a, b) => a.sku.localeCompare(b.sku),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => (<span className='font-mono text-xs'>{text}</span>),
      width: 100,
      // fixed: breakpoint == 'xs' ? undefined : 'left',
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
            mask: (
              <div className='flex flex-col items-center'>
                <div>Preview</div>
                <HugeiconsIcon icon={ViewIcon} />
              </div>
            ),
            src: record.main_image_url,
          }}
        />
      ),
      width: 80,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (_, record) => <ArtworkTitleStack artwork={record as ArtworkProps} />,
      // width: 250,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: ARTWORK_CATEGORIES.map((cat) => ({ text: cat.label, value: cat.value })),
      sorter: (a, b) => a.category.localeCompare(b.category),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => keyToTitle(text),
      // width: 250,
    },
    {
      title: 'Specifications',
      // dataIndex: 'specifications',
      key: 'specification',
      render: (_,record) => <ArtworkSpecificationsStack artwork={record as ArtworkProps} />,
      // width: 250,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      filters: locations?.map((loc) => ({ text: loc.name, value: loc.id })),
      render: (location) => (location ? (
        <LocationStack
          name={location.name}
          address={location.formatted_address}
        />
      ) : ''),
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
      filters: ARTWORK_STATUSES.map((status) => ({ text: status.label, value: status.value })),
      render: (text) => <ArtworkStatusTag status={text} />,
      // width: 250,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (<ArtworksActions artwork={record as ArtworkProps} />),
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
      width: 100,
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={artworks.data}
      size='small'
      scroll={{ x: 'max-content', y: '70vh' }}

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

        Object.entries(filters).forEach(([key, value]) => {
          if (value && value.length > 0) {
            urlParams.set(key, String(value));
          } else {
            urlParams.delete(key);
          }
        });

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
