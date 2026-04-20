import { Button, Image, Space, Tag } from "antd";
import { REQUEST_STATUS, REQUEST_STATUS_META } from "./requestStatus";

const toImageUrl = (path) => {
  if (!path) {
    return path;
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `http://localhost:5000${path}`;
};

const renderStatus = (status) => {
  const current = REQUEST_STATUS_META[status] || {
    color: "default",
    text: "UNKNOWN",
  };

  return <Tag color={current.color}>{current.text}</Tag>;
};

export const createRequestTableColumns = ({ onUpdate }) => [
  {
    title: "Request Type",
    dataIndex: "request_type",
    key: "request_type",
    render: (requestType) =>
      requestType === "user_verification" ? "User Verification" : "Provider Request",
  },
  {
    title: "First Name",
    dataIndex: ["User", "first_name"],
    key: "first_name",
  },
  {
    title: "Last Name",
    dataIndex: ["User", "last_name"],
    key: "last_name",
  },
  {
    title: "Email",
    dataIndex: ["User", "email"],
    key: "email",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: renderStatus,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    render: (location) => location || "-",
  },
  {
    title: "Place Image",
    dataIndex: "img_path",
    key: "img_path",
    render: (image, record) => {
      if (record.request_type !== "provider" || !image) {
        return "-";
      }

      return (
        <Image
          src={toImageUrl(image)}
          alt="Requested parking space"
          width={72}
          height={72}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      );
    },
  },
  {
    title: "Front ID",
    dataIndex: "front_img_path",
    key: "front_img_path",
    render: (image, record) => {
      if (record.request_type !== "user_verification" || !image) {
        return "-";
      }

      return (
        <Image
          src={toImageUrl(image)}
          alt="Front ID"
          width={72}
          height={72}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      );
    },
  },
  {
    title: "Back ID",
    dataIndex: "back_img_path",
    key: "back_img_path",
    render: (image, record) => {
      if (record.request_type !== "user_verification" || !image) {
        return "-";
      }

      return (
        <Image
          src={toImageUrl(image)}
          alt="Back ID"
          width={72}
          height={72}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => {
      if (record.status !== REQUEST_STATUS.pending) {
        return null;
      }

      return (
        <Space>
          <Button
            type="primary"
            onClick={() => onUpdate(record.id, REQUEST_STATUS.approved)}
            size="small"
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => onUpdate(record.id, REQUEST_STATUS.rejected)}
            size="small"
          >
            Reject
          </Button>
        </Space>
      );
    },
  },
];
