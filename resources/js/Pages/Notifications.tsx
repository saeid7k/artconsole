import PageTitle from "@/Components/PageTitle"
import { useApp } from "@/contexts/AppContext"
import { useWindow } from "@/hooks/useWindow"
import AppLayout from "@/Layouts/AppLayout"
import { PageProps } from "@/types"
import { NotificationProps } from "@/types/notification"
import { dayjsUserTz } from "@/utils/dateTimeHelper"
import { keyToTitle } from "@/utils/stringHelper"
import { InboxIcon, InboxUnreadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, Table, TableProps, Tooltip } from "antd"
import axios from "axios"
import { twMerge } from "tailwind-merge"

function Notifications({ notifications }: { notifications: PageProps}) {

  const { fetchIntervalData } = useApp()
  const { breakpoint } = useWindow()

  function toggleMarkAsRead(notification: NotificationProps) {
    let endpoint = notification.read_at
      ? 'notifications.mark-as-unread'
      : 'notifications.mark-as-read';
    axios.post(
      route(endpoint, notification.id)
    )
    .finally(() => {
      router.reload()
      fetchIntervalData()
    });
  }

  function handleClickLink(notification: NotificationProps) {
    if (notification.data?.route) {
      router.visit(route(notification.data.route));
    }
    if (!notification.read_at) {
      toggleMarkAsRead(notification);
    }
  }

  const columns: TableProps['columns'] = [
    {
      title: 'Event',
      dataIndex: 'type',
      key: 'event',
      render: (text, record) => (
        <div
          className={twMerge(
            "min-w-max",
            record.read_at ? '' : 'font-semibold'
          )}
        >
          {keyToTitle(text)}
        </div>
      ),
      width: 'max-content',
    },
    {
      title: 'Message',
      dataIndex: ['data', 'message'],
      key: 'message',
      render: (text, record) => (
        <div className="flex justify-between group">
          <div className="min-w-[250px] line-clamp-1">{text}</div>
          {record.data?.route && (
            <Button
              type="default"
              size="small"
              className="opacity-0 group-hover:opacity-100"
              onClick={() => handleClickLink(record as NotificationProps)}
            >
              Go
            </Button>
          )}
        </div>
      ),
      // width: 200,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (text) => (<div className="min-w-max">{dayjsUserTz(text).format('LLL')}</div>),
      width: 'max-content',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Tooltip title={record.read_at ? "Mark as Unread" : "Mark as Read"}>
            <Button
              type="text"
              shape="circle"
              icon={
                <HugeiconsIcon
                  icon={record.read_at ? InboxIcon : InboxUnreadIcon}
                  className={record.read_at ? "!text-gray-400" : "!text-blue-600"}
                  strokeWidth={record.read_at ? 1 : 2}
                  size={20}
                />
              }
              onClick={() => toggleMarkAsRead(record as NotificationProps)}
            />
          </Tooltip>
        </div>
      ),
      fixed: ['xs', 'sm'].includes(breakpoint) ? undefined : 'right',
      width: 100,
    }
  ]

  return (
    <div>
      <PageTitle
        title="Notifications"
        toolbar={
          <Button
            type="default"
            onClick={() => {
              axios.post(route('notifications.mark-all-as-read'))
                .then(() => {
                  router.reload();
                  fetchIntervalData();
                });
            }}
          >
            Mark all as read
          </Button>
        }
      />
      <Table
        columns={columns}
        dataSource={notifications.data}
        size='small'
        rowClassName={(record) => {
          return record.read_at ? '' : 'font-semibold bg-blue-50 dark:bg-blue-950';
        }}
        scroll={{ x: 'min-content' }}
        pagination={{
          current: notifications.current_page,
          total: notifications.total,
          pageSize: notifications.per_page,
          showSizeChanger: true,
        }}
        onChange={(pagination, filters, sorter: any) => {
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.set('sort_by', typeof sorter.field === 'string' ? sorter.field : String(sorter.field ?? ''));
          urlParams.set('sort_order', sorter.order === 'ascend' ? 'asc' : 'desc');
          urlParams.set('page', String(pagination.current));
          urlParams.set('per_page', String(pagination.pageSize));

          router.get(
            route('notifications.index'),
            Object.fromEntries(urlParams.entries()),
            { preserveScroll: true, preserveState: true }
          );
        }}
      />
    </div>
  )
}

Notifications.layout = (page: React.ReactNode) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Notifications
