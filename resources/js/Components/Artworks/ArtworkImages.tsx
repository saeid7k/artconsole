import { ArtworkProps } from "@/types/artwork";
import { downloadFile } from "@/utils/downloadHelper";
import { Delete02Icon, Download01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, message, Table, TableProps, Tooltip } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import FlexBox from "../Containers/FlexBox";
import LoadingSpinner from "../LoadingSpinner";
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
    enabled: (artwork.id && !artwork.images) ? true : false,
  });

  useEffect(() => {
    if (imagesQuery.isEnabled) {
      imagesQuery.refetch();
    }
  }, [artwork.id]);

  // set as main image

  const setAsMainImageMutation = useMutation({
    mutationFn: (mediaId: number) => {
      return axios.post(route('artworks.set-main-image', { artwork: artwork.id }), {
        media_id: mediaId,
      });
    },
    onSuccess: () => {
      message.success('Set as main image successfully');
      router.reload();
      // imagesQuery.refetch();
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to set as main image');
    }
  });

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
      sorter: (a, b) => a.file_name.localeCompare(b.file_name),
      showSorterTooltip: false,
      render: (_, record) => (<ArtworkImageNameStack media={record} />)
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      key: 'dimensions',
      sorter: (a, b) => {
        const [aWidth, aHeight] = a.dimensions.split('x').map((dim: string) => parseInt(dim.trim()));
        const [bWidth, bHeight] = b.dimensions.split('x').map((dim: string) => parseInt(dim.trim()));
        if (aWidth === bWidth) {
          return aHeight - bHeight;
        }
        return aWidth - bWidth;
      },
      showSorterTooltip: false,
      render: (text) => text
    },
    {
      title: 'Uploaded At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      showSorterTooltip: false,
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
              onClick={() => setAsMainImageMutation.mutate(record.id)}
            >
              <HugeiconsIcon icon={StarIcon} size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Download" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="purple"
              shape="circle"
              onClick={() => downloadFile({
                url: route('artworks.download-image', { artwork: artwork.id, media_id: record.id }),
                fileName: record.file_name,
              })}
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

  const images = artwork.images ? artwork.images : (imagesQuery.data || []);

  return (
    <>
      {imagesQuery.isLoading && (
        <LoadingSpinner />
      )}
      {images.length > 0 && (
        <Table
          dataSource={images}
          columns={columns}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      )}
    </>
  )
}

export default ArtworkImages;
