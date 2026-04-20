import { Table, Tag } from "antd";
import PageSection from "../../../components/PageSection";
import useAsyncList from "../../../hooks/useAsyncList";
import { useAuth } from "../../auth/AuthContext";
import { getParkingReservations } from "../controllers/parkingReservationService";

const columns = [
  {
    title: "Parking Space",
    key: "space_name",
    render: (_, record) => record.ParkingSpace?.space_name || "-",
  },
  {
    title: "Location",
    key: "location",
    render: (_, record) => record.ParkingSpace?.location || "-",
  },
  {
    title: "Payment Mode",
    dataIndex: "payment_mode",
    key: "payment_mode",
    render: (value) => value?.toUpperCase() || "-",
  },
  {
    title: "Plate Number",
    dataIndex: "plate_number",
    key: "plate_number",
    render: (value) => value || "-",
  },
  {
    title: "Parking Time",
    dataIndex: "parking_time",
    key: "parking_time",
    render: (value) => new Date(value).toLocaleString(),
  },
  {
    title: "Duration",
    dataIndex: "duration_hours",
    key: "duration_hours",
    render: (value) => `${value} hour${Number(value) > 1 ? "s" : ""}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => <Tag color="blue">{value?.toUpperCase() || "BOOKED"}</Tag>,
  },
];

const BookedParkingsPage = () => {
  const { currentUser } = useAuth();
  const { items: reservations, loading } = useAsyncList({
    loadItems: () => getParkingReservations(currentUser.id),
    errorMessage: "Failed to load booked parkings",
  });

  return (
    <PageSection title="Booked Parkings">
      <Table
        columns={columns}
        dataSource={reservations}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 8,
          showTotal: (total) => `Total ${total} booked parkings`,
        }}
      />
    </PageSection>
  );
};

export default BookedParkingsPage;
