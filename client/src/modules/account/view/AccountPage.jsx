import {
  Button,
  Card,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Tag,
  Upload,
  message,
} from "antd";
import { List } from "antd-mobile";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import PageSection from "../../../components/PageSection";
import { useAuth } from "../../auth/AuthContext";
import {
  requestProviderAccess,
  requestUserVerification,
} from "../../users/controllers/userService";
import { USER_TYPES } from "../../users/config/userTypes";
import { REQUEST_STATUS } from "../../requests/config/requestStatus";
import { getRequests } from "../../requests/controllers/requestService";
import useAsyncList from "../../../hooks/useAsyncList";
import useIsMobile from "../../../hooks/useIsMobile";

const requestStatusMap = {
  [REQUEST_STATUS.pending]: { color: "gold", label: "PENDING" },
  [REQUEST_STATUS.approved]: { color: "green", label: "APPROVED" },
  [REQUEST_STATUS.rejected]: { color: "red", label: "REJECTED" },
};

const AccountPage = () => {
  const [submitting, setSubmitting] = useState("");
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [providerForm] = Form.useForm();
  const [verificationForm] = Form.useForm();
  const [providerImage, setProviderImage] = useState(null);
  const [providerImagePreview, setProviderImagePreview] = useState("");
  const [verificationFrontImage, setVerificationFrontImage] = useState(null);
  const [verificationFrontPreview, setVerificationFrontPreview] = useState("");
  const [verificationBackImage, setVerificationBackImage] = useState(null);
  const [verificationBackPreview, setVerificationBackPreview] = useState("");
  const { currentUser, refreshCurrentUser } = useAuth();
  const isMobile = useIsMobile();
  const { items: requests, reload } = useAsyncList({
    loadItems: getRequests,
    errorMessage: "Failed to load account requests",
  });

  const myRequests = requests.filter((request) => request.user_id === currentUser.id);
  const providerRequest = myRequests.find((request) => request.request_type === "provider");
  const verificationRequest = myRequests.find(
    (request) => request.request_type === "user_verification",
  );
  const providerLocation = Form.useWatch("location", providerForm);
  const verificationLocation = Form.useWatch("location", verificationForm);
  const isProviderRequestPending = providerRequest?.status === REQUEST_STATUS.pending;
  const canOpenProviderModal =
    currentUser.is_verified && !isProviderRequestPending && submitting !== "provider";
  const canSubmitProviderRequest =
    Boolean(providerLocation?.trim()) &&
    Boolean(providerImage) &&
    currentUser.is_verified &&
    !isProviderRequestPending &&
    submitting !== "provider";
  const isVerificationRequestPending =
    verificationRequest?.status === REQUEST_STATUS.pending;
  const canOpenVerificationModal =
    !currentUser.is_verified &&
    !isVerificationRequestPending &&
    submitting !== "verification";
  const canSubmitVerificationRequest =
    Boolean(verificationLocation?.trim()) &&
    Boolean(verificationFrontImage) &&
    Boolean(verificationBackImage) &&
    !currentUser.is_verified &&
    !isVerificationRequestPending &&
    submitting !== "verification";

  const submitRequest = async (type) => {
    try {
      setSubmitting(type);

      if (type === "provider") {
        const values = await providerForm.validateFields();

        if (!providerImage) {
          message.error("Please upload an image of the place");
          return;
        }

        const formData = new FormData();
        formData.append("location", values.location);
        formData.append("image", providerImage);

        await requestProviderAccess(currentUser.id, formData);
        message.success("Provider request submitted");
        providerForm.resetFields();
        setProviderImage(null);
        setProviderImagePreview("");
        setIsProviderModalOpen(false);
      }

      if (type === "verification") {
        const values = await verificationForm.validateFields();

        if (!verificationFrontImage || !verificationBackImage) {
          message.error(
            "Please upload the location, front image, and back image of your ID",
          );
          return;
        }

        const formData = new FormData();
        formData.append("location", values.location);
        formData.append("frontImage", verificationFrontImage);
        formData.append("backImage", verificationBackImage);

        await requestUserVerification(currentUser.id, formData);
        message.success("User verification request submitted");
        verificationForm.resetFields();
        setVerificationFrontImage(null);
        setVerificationFrontPreview("");
        setVerificationBackImage(null);
        setVerificationBackPreview("");
        setIsVerificationModalOpen(false);
      }

      await Promise.all([reload(), refreshCurrentUser()]);
    } catch (error) {
      message.error(error?.response?.data?.error || "Request failed");
      console.error(error);
    } finally {
      setSubmitting("");
    }
  };

  const getRequestTag = (request) => {
    if (!request) {
      return <Tag>NOT REQUESTED</Tag>;
    }

    const meta = requestStatusMap[request.status] || {
      color: "default",
      label: "UNKNOWN",
    };

    return <Tag color={meta.color}>{meta.label}</Tag>;
  };

  const handleProviderImageUpload = async ({ file }) => {
    try {
      setProviderImage(file);
      setProviderImagePreview(URL.createObjectURL(file));
      message.success("Place image selected");
    } catch (error) {
      message.error("Failed to read image");
      console.error(error);
    }
  };

  const handleBeforeUpload = async (file) => {
    await handleProviderImageUpload({ file });
    return false;
  };

  const handleVerificationImageUpload = async ({ file, side }) => {
    try {
      if (side === "front") {
        setVerificationFrontImage(file);
        setVerificationFrontPreview(URL.createObjectURL(file));
      }

      if (side === "back") {
        setVerificationBackImage(file);
        setVerificationBackPreview(URL.createObjectURL(file));
      }

      message.success(`ID ${side} image selected`);
    } catch (error) {
      message.error("Failed to read image");
      console.error(error);
    }
  };

  return (
    <PageSection title="My Account">
      <Card>
        {isMobile ? (
          <List mode="card">
            <List.Item extra={`${currentUser.first_name} ${currentUser.last_name}`}>
              Name
            </List.Item>
            <List.Item extra={currentUser.phone_number}>Phone Number</List.Item>
            <List.Item extra={currentUser.email}>Email</List.Item>
            <List.Item
              extra={
                <Tag color={currentUser.user_type_id === USER_TYPES.provider ? "green" : "blue"}>
                  {currentUser.user_type_id === USER_TYPES.provider ? "PROVIDER" : "NORMAL USER"}
                </Tag>
              }
            >
              Role
            </List.Item>
            <List.Item
              extra={
                <Tag color={currentUser.is_verified ? "green" : "default"}>
                  {currentUser.is_verified ? "VERIFIED" : "NOT VERIFIED"}
                </Tag>
              }
            >
              Verification Status
            </List.Item>
            <List.Item extra={getRequestTag(providerRequest)}>Provider Request</List.Item>
            <List.Item extra={getRequestTag(verificationRequest)}>
              User Verification Request
            </List.Item>
          </List>
        ) : (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">
              {currentUser.first_name} {currentUser.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {currentUser.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{currentUser.email}</Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={currentUser.user_type_id === USER_TYPES.provider ? "green" : "blue"}>
                {currentUser.user_type_id === USER_TYPES.provider ? "PROVIDER" : "NORMAL USER"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Verification Status">
              <Tag color={currentUser.is_verified ? "green" : "default"}>
                {currentUser.is_verified ? "VERIFIED" : "NOT VERIFIED"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Provider Request">
              {getRequestTag(providerRequest)}
            </Descriptions.Item>
            <Descriptions.Item label="User Verification Request">
              {getRequestTag(verificationRequest)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {currentUser.user_type_id === USER_TYPES.normal ? (
        <>
          <Space style={{ marginTop: "24px" }} wrap>
            {currentUser.is_verified ? (
              <Button
                type="primary"
                onClick={() => setIsProviderModalOpen(true)}
                disabled={!canOpenProviderModal}
              >
                {isProviderRequestPending
                  ? "Provider Request Pending"
                  : "Register as Provider"}
              </Button>
            ) : null}
            <Button
              onClick={() => setIsVerificationModalOpen(true)}
              disabled={!canOpenVerificationModal}
            >
              {currentUser.is_verified
                ? "Already Verified"
                : isVerificationRequestPending
                  ? "Verification Pending"
                  : "Request User Verification"}
            </Button>
          </Space>

          <Modal
            title="Provider Registration"
            open={isProviderModalOpen}
            onCancel={() => {
              setIsProviderModalOpen(false);
              providerForm.resetFields();
              setProviderImage(null);
              setProviderImagePreview("");
            }}
            onOk={() => submitRequest("provider")}
            okText="Submit Provider Request"
            confirmLoading={submitting === "provider"}
            okButtonProps={{ disabled: !canSubmitProviderRequest }}
            destroyOnHidden
          >
            <Form form={providerForm} layout="vertical">
              <Form.Item
                name="location"
                label="Location of the Space"
                rules={[{ required: true, message: "Please enter the location" }]}
              >
                <Input placeholder="Enter the parking space location" />
              </Form.Item>

              <Form.Item
                label="Image of the Place"
                required
                validateStatus={!providerImage && submitting === "provider" ? "error" : ""}
                help={
                  !providerImage && submitting === "provider"
                    ? "Please upload an image of the place"
                    : ""
                }
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={handleBeforeUpload}
                >
                  <Button icon={<UploadOutlined />}>Choose Image</Button>
                </Upload>

                {providerImagePreview ? (
                  <div style={{ marginTop: "16px" }}>
                    <Image
                      src={providerImagePreview}
                      alt="Place preview"
                      width={180}
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                ) : null}
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Request User Verification"
            open={isVerificationModalOpen}
            onCancel={() => {
              setIsVerificationModalOpen(false);
              verificationForm.resetFields();
              setVerificationFrontImage(null);
              setVerificationFrontPreview("");
              setVerificationBackImage(null);
              setVerificationBackPreview("");
            }}
            onOk={() => submitRequest("verification")}
            okText="Submit Verification Request"
            confirmLoading={submitting === "verification"}
            okButtonProps={{ disabled: !canSubmitVerificationRequest }}
            destroyOnHidden
          >
            <Form form={verificationForm} layout="vertical">
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter your location" }]}
              >
                <Input placeholder="Enter your location" />
              </Form.Item>

              <Form.Item
                label="Front Image of ID"
                required
                validateStatus={
                  !verificationFrontImage && submitting === "verification"
                    ? "error"
                    : ""
                }
                help={
                  !verificationFrontImage && submitting === "verification"
                    ? "Please upload the front image of your ID"
                    : ""
                }
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    await handleVerificationImageUpload({ file, side: "front" });
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Choose Front Image</Button>
                </Upload>

                {verificationFrontPreview ? (
                  <div style={{ marginTop: "16px" }}>
                    <Image
                      src={verificationFrontPreview}
                      alt="Front ID preview"
                      width={180}
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                ) : null}
              </Form.Item>

              <Form.Item
                label="Back Image of ID"
                required
                validateStatus={
                  !verificationBackImage && submitting === "verification"
                    ? "error"
                    : ""
                }
                help={
                  !verificationBackImage && submitting === "verification"
                    ? "Please upload the back image of your ID"
                    : ""
                }
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    await handleVerificationImageUpload({ file, side: "back" });
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Choose Back Image</Button>
                </Upload>

                {verificationBackPreview ? (
                  <div style={{ marginTop: "16px" }}>
                    <Image
                      src={verificationBackPreview}
                      alt="Back ID preview"
                      width={180}
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                ) : null}
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : null}
    </PageSection>
  );
};

export default AccountPage;
