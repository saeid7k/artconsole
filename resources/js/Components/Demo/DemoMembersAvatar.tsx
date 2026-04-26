import { Avatar } from "antd";

function DemoMembersAvatar() {

  const images = import.meta.glob('/resources/demo/demo-members/*.jpg', { eager: true, as: 'url' });
  const imageUrls = Object.values(images);

  return (
    <Avatar.Group size="small" max={{ count: 4 }}>
      {Array(4).fill(0).map((_, index) => (
        <Avatar key={index} src={imageUrls[index]} />
      ))}
      <Avatar />
    </Avatar.Group>
  )
}

export default DemoMembersAvatar;
