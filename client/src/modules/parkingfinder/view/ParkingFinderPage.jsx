import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
  message,
} from "antd";
import { useState } from "react";
import PageSection from "../../../components/PageSection";
import useAsyncList from "../../../hooks/useAsyncList";
import { getParkingSpaces } from "../../parkinglot/controllers/parkingSpaceService";
import ParkingSpaceTable from "../../parkinglot/components/ParkingSpaceTable";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { createParkingReservation } from "../controllers/parkingReservationService";
import { useAuth } from "../../auth/AuthContext";

const toImageUrl = (path) => {
  if (!path) {
    return path;
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `http://localhost:5000${path}`;
};

const ParkingFinderPage = () => {
  const [bookingForm] = Form.useForm();
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null);
  const [bookingParkingSpace, setBookingParkingSpace] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const { currentUser } = useAuth();
  const { items: parkingSpaces, loading, reload } = useAsyncList({
    loadItems: getParkingSpaces,
    errorMessage: "Failed to load parking spaces",
  });

  const handleBookParkingSpace = async () => {
    try {
      const values = await bookingForm.validateFields();
      setSubmittingBooking(true);
      await createParkingReservation({
        parking_space_id: bookingParkingSpace.id,
        user_id: currentUser.id,
        payment_mode: values.payment_mode,
        plate_number: values.plate_number,
        parking_time: values.parking_time.toISOString(),
        duration_hours: values.duration_hours,
      });
      message.success("Parking space availed successfully");
      bookingForm.resetFields();
      setBookingParkingSpace(null);
      await reload();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      message.error(
        error?.response?.data?.error || "Failed to avail parking space",
      );
      console.error(error);
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <PageSection title="Find Parking Space">
      <ParkingSpaceTable
        data={parkingSpaces}
        loading={loading}
        onView={setSelectedParkingSpace}
        showViewAction
        onAvail={setBookingParkingSpace}
        showAvailAction
      />

      <MapContainer
        center={[16.4023, 120.596]}
        zoom={13}
        style={{
          height: 360,
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          marginTop: 24,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parkingSpaces
          .filter((parkingSpace) => parkingSpace.latitude && parkingSpace.longitude)
          .map((parkingSpace) => (
            <Marker
              key={parkingSpace.id}
              position={[
                Number(parkingSpace.latitude),
                Number(parkingSpace.longitude),
              ]}
              eventHandlers={{
                click: () => setSelectedParkingSpace(parkingSpace),
              }}
            />
          ))}
      </MapContainer>

      <Modal
        title="Parking Space Details"
        open={Boolean(selectedParkingSpace)}
        onCancel={() => setSelectedParkingSpace(null)}
        footer={null}
        width={800}
        destroyOnHidden
      >
        {selectedParkingSpace ? (
          <>
            <Descriptions column={1} bordered style={{ marginBottom: "24px" }}>
              <Descriptions.Item label="Space Name">
                {selectedParkingSpace.space_name}
              </Descriptions.Item>
              <Descriptions.Item label="Provider">
                {selectedParkingSpace.User
                  ? `${selectedParkingSpace.User.first_name} ${selectedParkingSpace.User.last_name}`
                  : "Unknown Provider"}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedParkingSpace.location}
              </Descriptions.Item>
              <Descriptions.Item label="Coordinates">
                {Number(selectedParkingSpace.latitude).toFixed(6)},{" "}
                {Number(selectedParkingSpace.longitude).toFixed(6)}
              </Descriptions.Item>
              <Descriptions.Item label="Price / Hour">
                PHP {Number(selectedParkingSpace.price_per_hour).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Slots Available">
                {selectedParkingSpace.slots_available}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedParkingSpace.description || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {Number(selectedParkingSpace.slots_available) > 0 ? (
                  <Tag color="green">AVAILABLE</Tag>
                ) : (
                  <Tag color="red">FULL</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>

            <MapContainer
              center={[
                Number(selectedParkingSpace.latitude),
                Number(selectedParkingSpace.longitude),
              ]}
              zoom={16}
              style={{
                height: 280,
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 24,
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[
                  Number(selectedParkingSpace.latitude),
                  Number(selectedParkingSpace.longitude),
                ]}
              />
            </MapContainer>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {selectedParkingSpace.ParkingSpaceImages?.length ? (
                selectedParkingSpace.ParkingSpaceImages.map((image) => (
                  <Image
                    key={image.id}
                    src={toImageUrl(image.img_path)}
                    alt="Parking space"
                    width={180}
                    height={180}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                ))
              ) : (
                <span>No parking space images uploaded.</span>
              )}
            </div>
          </>
        ) : null}
      </Modal>

      <Modal
        title="Avail Parking Space"
        open={Boolean(bookingParkingSpace)}
        onCancel={() => {
          setBookingParkingSpace(null);
          bookingForm.resetFields();
        }}
        onOk={handleBookParkingSpace}
        okText="Confirm Booking"
        confirmLoading={submittingBooking}
        destroyOnHidden
      >
        {bookingParkingSpace ? (
          <Form form={bookingForm} layout="vertical">
            <Form.Item label="Parking Space">
              <strong>{bookingParkingSpace.space_name}</strong>
            </Form.Item>
            <Form.Item
              name="plate_number"
              label="Plate Number"
              rules={[{ required: true, message: "Please enter your plate number" }]}
            >
              <Input placeholder="Enter plate number" />
            </Form.Item>
            <Form.Item
              name="payment_mode"
              label="Mode of Payment"
              rules={[{ required: true, message: "Please select a mode of payment" }]}
            >
              <Select
                placeholder="Select payment mode"
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "gcash", label: "GCash" },
                  { value: "maya", label: "Maya" },
                  { value: "card", label: "Card" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="parking_time"
              label="Time to Park"
              rules={[{ required: true, message: "Please select a parking time" }]}
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="duration_hours"
              label="Duration (Hours)"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        ) : null}
      </Modal>
    </PageSection>
  );
};

export default ParkingFinderPage;
