import { useArtworksIndex } from '@/contexts/ArtworksIndexContext';
import { useWindow } from '@/hooks/useWindow';
import { PageProps } from '@/types';
import { LocationProps } from '@/types/location';
import { keyToTitle } from '@/utils/stringHelper';
import { router } from '@inertiajs/react';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import LocationStack from './LocationStack';

function LocationsTable({ locations }: {locations: PageProps}) {

  const { breakpoint, windowWidth } = useWindow()
  const { filters } = useArtworksIndex()

  const columns: TableProps<LocationProps>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (_, record) => <LocationStack location={record} showAddress showActions={false} showPrimaryTag clamped={false} />,
      // width: 250,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => (keyToTitle(text)),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (<div>Actions</div>),
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
      width: 100,
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={locations.data}
      size='small'
      scroll={{ x: 'max-content', y: windowWidth < 640 ? '60vh' : '70vh' }}

      pagination={{
        current: locations.current_page,
        total: locations.total,
        pageSize: locations.per_page,
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
          route('locations.index'),
          Object.fromEntries(urlParams.entries()),
          { preserveScroll: true, preserveState: true }
        );
      }}
    />
  )
}

export { LocationsTable as default };
