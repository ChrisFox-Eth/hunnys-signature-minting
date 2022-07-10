import React from "react";

export default function FAQ() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: -120,
          right: -80,
          height: 300,
          width: 150,
          transform: "rotate(45deg)",
          cursor: "pointer",
        }}
        role="button"
        onClick={() =>
          window.open(
            "https://hunnys.net",
            "_blank"
          )
        }
      />

      <div
        style={{
          position: "fixed",
          bottom: 14,
          right: 18,
        }}
      >
        <img
          src={"https://www.hunnys.net/favicon.ico"}
          width={40}
          height={40}
          role="button"
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.open(
              "https://hunnys.net",
              "_blank"
            )
          }
        />
      </div>
    </>
  );
}
