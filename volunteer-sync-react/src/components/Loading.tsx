import React from "react";

interface LoadingProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = "medium",
}) => {
  const sizeConfig = {
    small: { spinner: 24, text: "14px", padding: "20px" },
    medium: { spinner: 40, text: "16px", padding: "40px" },
    large: { spinner: 60, text: "18px", padding: "60px" },
  };

  const config = sizeConfig[size];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: config.padding,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: config.spinner,
          height: config.spinner,
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #40c793",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      />
      <p
        style={{
          margin: 0,
          color: "#666",
          fontSize: config.text,
          textAlign: "center",
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default Loading;
