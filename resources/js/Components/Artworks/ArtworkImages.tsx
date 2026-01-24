import { ArtworkProps } from "@/types/artwork";
import { useQuery } from "@tanstack/react-query";
import { Table, TableProps, Tag } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import FlexBox from "../Containers/FlexBox";
import CopyToClipboard from "../CopyToClipboard";

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
      render: (_, record) => (
        <FlexBox>
          <div>{record.file_name}</div>
          <CopyToClipboard content={record.file_name} title="File Name" />
          {record.custom_properties?.is_main && (
            <Tag variant="solid" color="blue" className="ml-2">Main</Tag>
          )}
        </FlexBox>
      )
    },
    {
      title: 'Uploaded At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => dayjs(text).format('MMM D, YYYY h:mm A'),
    },
  ]

  return (
    <Table
      dataSource={imagesQuery.data || []}
      columns={columns}
      size="small"
    />
  )
}

export default ArtworkImages;
