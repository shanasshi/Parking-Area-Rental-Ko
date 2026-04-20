import { Button, Form, Image, Input, InputNumber, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ParkingSpaceMapPicker from "./ParkingSpaceMapPicker";

const toImagePreview = (path) => {
  if (!path) {
    return path;
  }

  if (path.startsWith("blob:") || path.startsWith("http")) {
    return path;
  }

  return `http://localhost:5000${path}`;
};

const ParkingSpaceForm = ({ initialValues, onSubmit, submitting, submitLabel }) => {
  const [form] = Form.useForm();
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      space_name: initialValues?.space_name || "",
      location: initialValues?.location || "",
      latitude: initialValues?.latitude || undefined,
      longitude: initialValues?.longitude || undefined,
      price_per_hour: initialValues?.price_per_hour || undefined,
      slots_available: initialValues?.slots_available || 1,
      description: initialValues?.description || "",
    });

    setImagePreviews(
      (initialValues?.ParkingSpaceImages || []).map((image) => ({
        file: null,
        preview: toImagePreview(image.img_path),
        existing: true,
      })),
    );
  }, [form, initialValues]);

  const handleFinish = async (values) => {
    const success = await onSubmit({
      ...values,
      images: imagePreviews.map((item) => item.file).filter(Boolean),
    });

    if (success) {
      form.resetFields();
      setImagePreviews([]);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ marginBottom: "24px" }}
    >
      <Form.Item
        name="space_name"
        label="Space Name"
        rules={[{ required: true, message: "Please enter a space name" }]}
      >
        <Input placeholder="Example: Covered Slot A1" />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: "Please enter a location" }]}
      >
        <Input placeholder="Example: Mabini Street, Baguio City" />
      </Form.Item>
      <Form.Item
        name="latitude"
        hidden
        rules={[{ required: true, message: "Please choose a map location" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="longitude"
        hidden
        rules={[{ required: true, message: "Please choose a map location" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        shouldUpdate={(previous, current) =>
          previous.latitude !== current.latitude ||
          previous.longitude !== current.longitude
        }
        noStyle
      >
        {({ getFieldValue, setFieldsValue }) => (
          <Form.Item
            label="Pick Location on Map"
            required
            validateStatus={
              getFieldValue("latitude") && getFieldValue("longitude") ? "" : "error"
            }
            help={
              getFieldValue("latitude") && getFieldValue("longitude")
                ? ""
                : "Please click a location on the map"
            }
          >
            <ParkingSpaceMapPicker
              value={{
                latitude: getFieldValue("latitude"),
                longitude: getFieldValue("longitude"),
              }}
              onChange={({ latitude, longitude }) =>
                setFieldsValue({
                  latitude,
                  longitude,
                })
              }
            />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        name="price_per_hour"
        label="Price Per Hour"
        rules={[{ required: true, message: "Please enter a price" }]}
      >
        <InputNumber
          min={1}
          precision={2}
          style={{ width: "100%" }}
          placeholder="100"
        />
      </Form.Item>

      <Form.Item
        name="slots_available"
        label="Slots Available"
        initialValue={1}
        rules={[{ required: true, message: "Please enter available slots" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea
          rows={4}
          placeholder="Add details about access, opening hours, or special notes"
        />
      </Form.Item>

      <Form.Item label="Parking Space Images">
        <Upload
          accept="image/*"
          multiple
          maxCount={6}
          showUploadList={false}
          beforeUpload={(file) => {
            setImagePreviews((current) => [
              ...current,
              {
                file,
                preview: URL.createObjectURL(file),
              },
            ]);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Choose Parking Images</Button>
        </Upload>

        {imagePreviews.length ? (
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {imagePreviews.map((image) => (
              <Image
                key={image.preview}
                src={image.preview}
                alt="Parking space preview"
                width={120}
                height={120}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            ))}
          </div>
        ) : null}
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        loading={submitting}
      >
        {submitLabel}
      </Button>
    </Form>
  );
};

export default ParkingSpaceForm;
