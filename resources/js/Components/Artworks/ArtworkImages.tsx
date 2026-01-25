import { ArtworkProps } from "@/types/artwork";
import { Delete02Icon, Download01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, TableProps, Tooltip } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import FlexBox from "../Containers/FlexBox";
import ArtworkImageNameStack from "./ArtworkImageNameStack";

function ArtworkImages({ artwork }: { artwork: ArtworkProps }) {

  const imagesQuery = useQuery({
    queryKey: ['artwork-images'],
    queryFn: () => {
      return axios.get(route('artworks.images', {artwork: artwork.id}))
        .then(res => res.data.images)
        .catch(err => {
          throw err;
        })
    },
    enabled: artwork.id ? true : false,
  });

  useEffect(() => {
    imagesQuery.refetch();
  }, [artwork.images, artwork.id]);

  const columns: TableProps<any>['columns'] = [
    {
      title: '',
      dataIndex: 'urls',
      key: 'urls',
      render: (urls) => (
        <img
          src={urls.thumb}
          alt="Artwork Image"
          className="h-[50px] w-[50px] object-cover"
        />
      )
    },
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (_, record) => (<ArtworkImageNameStack media={record} />)
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      key: 'dimensions',
      render: (text, record) => text
    },
    {
      title: 'Uploaded At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (
        <FlexBox direction="col" gap={0} alignItems="start" >
          <div>{dayjs(text).format('MMM D, YYYY')}</div>
          <div className="text-muted">{dayjs(text).format('h:mm A')}</div>
        </FlexBox>
      ),
      width: 1,
      className: 'whitespace-nowrap',
    },
    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <FlexBox>
          <Tooltip title="Set as Main Image" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="blue"
              shape="circle"
              disabled={record?.is_main}
            >
              <HugeiconsIcon icon={StarIcon} size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Download" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="purple"
              shape="circle"
            >
              <HugeiconsIcon icon={Download01Icon} size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="red"
              shape="circle"
            >
              <HugeiconsIcon icon={Delete02Icon} size={20} />
            </Button>
          </Tooltip>
        </FlexBox>
      ),
      width: 1,
    }
  ]

  return (
    <Table
      dataSource={imagesQuery.data || []}
      columns={columns}
      size="small"
      scroll={{ x: 'max-content' }}
    />
  )
}

export default ArtworkImages;
