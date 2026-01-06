import React from "react";

function RecruitMessage() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        height: "180px",
        background: "rgba(10, 22, 40, 0.95)",
        border: "2px solid #c9a227",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "30px",
        zIndex: 200,
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <p
        style={{
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "bold",
          margin: 0,
          lineHeight: "1.4",
          fontFamily: '"Cinzel", serif',
        }}
      >
        How about fighting once more, soldier?
      </p>
      <div
        style={{
          marginTop: "20px",
          width: "60px",
          height: "2px",
          background: "#c9a227",
        }}
      ></div>
    </div>
  );
}

export default RecruitMessage;
