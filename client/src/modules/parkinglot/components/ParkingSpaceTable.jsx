import { Button, Image, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const toImageUrl = (path) => {
  if (!path) {
    return path;
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `http://localhost:5000${path}`;
};

const createColumns = ({
  onEdit,
  onDelete,
  onView,
  onAvail,
  showActions,
  showViewAction,
  showAvailAction,
}) => [
  {
    title: "Space Name",
    dataIndex: "space_name",
    key: "space_name",
  },
  {
    title: "Provider",
    key: "provider",
    render: (_, record) =>
      record.User
        ? `${record.User.first_name} ${record.User.last_name}`
        : "Unknown Provider",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Image",
    key: "image",
    render: (_, record) => {
      const firstImage = record.ParkingSpaceImages?.[0]?.img_path;

      if (!firstImage) {
        return "-";
      }

      return (
        <Image
          src={toImageUrl(firstImage)}
          alt="Parking space"
          width={72}
          height={72}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      );
    },
  },
  {
    title: "Price / Hour",
    dataIndex: "price_per_hour",
    key: "price_per_hour",
    render: (value) => `PHP ${Number(value).toFixed(2)}`,
  },
  {
    title: "Slots",
    dataIndex: "slots_available",
    key: "slots_available",
  },
  {
    title: "Status",
    key: "status",
    render: (_, record) =>
      Number(record.slots_available) > 0 ? (
        <Tag color="green">AVAILABLE</Tag>
      ) : (
        <Tag color="red">FULL</Tag>
      ),
  },
  ...((showActions || showViewAction || showAvailAction)
    ? [
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Space>
              {showViewAction ? (
                <Tooltip title="View">
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => onView(record)}
                  />
                </Tooltip>
              ) : null}
              {showAvailAction ? (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => onAvail(record)}
                  disabled={Number(record.slots_available) <= 0}
                >
                  Avail
                </Button>
              ) : null}
              {showActions ? (
                <>
                  <Tooltip title="Edit">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => onEdit(record)}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Delete parking space?"
                    description="This action cannot be undone."
                    onConfirm={() => onDelete(record)}
                  >
                    <Tooltip title="Delete">
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                  </Popconfirm>
                </>
              ) : null}
            </Space>
          ),
        },
      ]
    : []),
];

const ParkingSpaceTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  onAvail,
  showActions = false,
  showViewAction = false,
  showAvailAction = false,
}) => {
  return (
    <Table
      columns={createColumns({
        onEdit,
        onDelete,
        onView,
        onAvail,
        showActions,
        showViewAction,
        showAvailAction,
      }).filter((column) => {
        if (column.key !== "actions") {
          return true;
        }

        return showActions || showViewAction || showAvailAction;
      })}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 8,
        showTotal: (total) => `Total ${total} parking spaces`,
      }}
    />
  );
};

export default ParkingSpaceTable;
