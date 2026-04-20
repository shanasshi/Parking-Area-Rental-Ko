import { Card, Typography } from "antd";
import useIsMobile from "../hooks/useIsMobile";

const { Title } = Typography;

const containerStyle = {
  padding: "24px",
  background: "#f0f2f5",
  minHeight: "100vh",
};

const cardStyle = {
  width: "100%",
  borderRadius: "8px",
};

const PageSection = ({ title, extra, children }) => {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        ...containerStyle,
        padding: isMobile ? "12px" : containerStyle.padding,
        minHeight: isMobile ? "auto" : containerStyle.minHeight,
      }}
    >
      <Card
        bordered={false}
        style={{
          ...cardStyle,
          borderRadius: isMobile ? "16px" : cardStyle.borderRadius,
        }}
      >
        {title ? (
          <div
            style={{
              marginBottom: isMobile ? "16px" : "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <Title level={isMobile ? 4 : 2} style={{ margin: 0 }}>
              {title}
            </Title>
            {extra}
          </div>
        ) : null}
        {children}
      </Card>
    </div>
  );
};

export default PageSection;
