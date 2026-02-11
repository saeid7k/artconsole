import ArtworkSpecificationsStack from '@/Components/Artworks/ArtworkSpecificationsStack';
import ArtworkStatusTag from '@/Components/Artworks/ArtworkStatusTag';
import ArtworkTitleStack from '@/Components/Artworks/ArtworkTitleStack';
import CopyToClipboard from '@/Components/CopyToClipboard';
import LocationStack from '@/Components/Locations/LocationStack';
import { ARTWORK_CATEGORIES } from '@/constants/artworkCategories';
import ARTWORK_STATUSES from '@/constants/artworkStatuses';
import { useArtworksIndex } from '@/contexts/ArtworksIndexContext';
import { useWindow } from '@/hooks/useWindow';
import { PageProps } from '@/types';
import { ArtworkProps } from '@/types/artwork';
import { formatCurrency } from '@/utils/formatHelper';
import { keyToTitle } from '@/utils/stringHelper';
import { ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link, router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Image, Table } from 'antd';
import imagePlaceholder from '~/resources/images/image-placeholder.svg';
import ArtworksActions from './ArtworksActions';
import useFilters from '@/hooks/useFilters';

type LocationsProps = Array<{
  id: number;
  name: string;
}>;

function ArtworksTable({ artworks, locations }: { artworks: PageProps, locations: LocationsProps }) {

  const { breakpoint, windowWidth } = useWindow()
  const { selectedIds, setSelectedIds } = useArtworksIndex()
  const { filters } = useFilters('artworks.index')

  const columns: TableProps['columns'] = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: (a, b) => a.sku.localeCompare(b.sku),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Link
            className='font-mono text-body text-xs whitespace-nowrap'
            href={route('artworks.show', record.id)}
          >
            {record.sku}
          </Link>
          <CopyToClipboard content={record.sku} title="SKU" />
        </div>
      ),
      width: 100,
      // fixed: breakpoint == 'xs' ? undefined : 'left',
    },
    {
      title: 'Preview',
      key: 'image',
      render: (_, record) => (
        <Image
          src={record.main_image_thumb_url || imagePlaceholder}
          alt={record.title}
          height={60}
          style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
          preview={record.main_image_thumb_url ? {
            cover: (
              <div className='flex flex-col items-center'>
                <div>Preview</div>
                <HugeiconsIcon icon={ViewIcon} />
              </div>
            ),
            src: record.main_image_url,
          } : false}
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
      render: (_, record) => <ArtworkTitleStack artwork={record as ArtworkProps} showYear={false} showSigned={false} />,
      // width: 250,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: ARTWORK_CATEGORIES.map((cat) => ({ text: cat.label, value: cat.value })),
      filteredValue: filters?.category?.length > 0 ? filters.category : null,
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
      filteredValue: filters?.location?.length > 0 ? filters.location : null,
      render: (location) => (location ? (
        <LocationStack
          location={location}
          showActions={false}
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
      render: (text) => formatCurrency(text, 2),
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
      filteredValue: filters?.status?.length > 0 ? filters.status : null,
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
      rowKey="id"
      columns={columns}
      dataSource={artworks.data}
      size='small'
      scroll={{ x: 'max-content', y: windowWidth < 640 ? '60vh' : '70vh' }}
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
      rowSelection={{
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
          setSelectedIds(selectedRowKeys as number[])
        }
      }}
    />
  )
}

export { ArtworksTable as default };
