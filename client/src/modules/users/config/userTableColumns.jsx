import { Button, Tag } from "antd";
import { REQUEST_STATUS, REQUEST_STATUS_META } from "../../requests/config/requestStatus";
import { USER_TYPES, USER_TYPE_META } from "./userTypes";

const renderNameCell = (value) => (
  <span style={{ fontWeight: 600, color: "#1890ff" }}>{value}</span>
);

const getUserTypeTag = (userTypeId) => {
  return (
    USER_TYPE_META[userTypeId] || {
      color: "default",
      label: "UNKNOWN",
    }
  );
};

const getRequestTag = (status) => {
  if (!status) {
    return { color: "default", label: "NOT REQUESTED" };
  }

  return (
    REQUEST_STATUS_META[status] || {
      color: "default",
      label: "UNKNOWN",
    }
  );
};

export const createUserTableColumns = ({ onRequestProvider, requestingUserId }) => [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name",
    render: renderNameCell,
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "last_name",
    render: renderNameCell,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
    key: "phone_number",
  },
  {
    title: "Role",
    key: "user_type_id",
    dataIndex: "user_type_id",
    render: (userTypeId) => {
      const tag = getUserTypeTag(userTypeId);

      return <Tag color={tag.color}>{tag.label}</Tag>;
    },
  },
  {
    title: "Verified",
    key: "is_verified",
    dataIndex: "is_verified",
    render: (isVerified) => (
      <Tag color={isVerified ? "green" : "default"}>
        {isVerified ? "VERIFIED" : "NOT VERIFIED"}
      </Tag>
    ),
  },
  {
    title: "Provider Request",
    key: "providerRequestStatus",
    dataIndex: "providerRequestStatus",
    render: (status) => {
      const tag = getRequestTag(status);

      return <Tag color={tag.color}>{tag.label}</Tag>;
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => {
      if (record.user_type_id === USER_TYPES.provider) {
        return <Tag color="green">CAN PROVIDE SPACE</Tag>;
      }

      if (record.user_type_id === USER_TYPES.admin) {
        return <Tag color="volcano">FULL ACCESS</Tag>;
      }

      const isPending = record.providerRequestStatus === REQUEST_STATUS.pending;
      const isLoading = requestingUserId === record.id;

      if (!onRequestProvider) {
        return (
          <Tag color={isPending ? "gold" : "default"}>
            {isPending ? "WAITING FOR APPROVAL" : "NORMAL USER"}
          </Tag>
        );
      }

      return (
        <Button
          type="primary"
          size="small"
          onClick={() => onRequestProvider(record.id)}
          disabled={isPending}
          loading={isLoading}
        >
          {isPending ? "Waiting for admin" : "Apply as Provider"}
        </Button>
      );
    },
  },
];
