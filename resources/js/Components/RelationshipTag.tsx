import { Tag } from "antd";

function RelationshipTag({ relationship }: { relationship: string }) {
  let color = 'default';

  switch (relationship) {
    case 'artist':
      color = 'purple';
      break;
    case 'vendor':
      color = 'orange';
      break;
    case 'collector':
      color = 'green';
      break;
    case 'other':
      color = 'default';
      break;
    default:
      color = 'default';
  }

  return (
    <Tag color={color} className="capitalize">
      {relationship}
    </Tag>
  );
}

export default RelationshipTag;
