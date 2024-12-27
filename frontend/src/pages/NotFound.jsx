import React from "react";

function NotFound() {
  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "radial-gradient(circle, black, #1a1a1a, #000000)",
    color: "red",
    fontFamily: "'Courier New', Courier, monospace",
    textAlign: "center",
    flexDirection: "column",
  };

  const textStyle = {
    fontSize: "4rem",
    fontWeight: "bold",
    textShadow: "0 0 10px red, 0 0 20px red",
  };

  const subTextStyle = {
    fontSize: "1.5rem",
    marginTop: "1rem",
    textShadow: "0 0 5px red",
  };

  return (
    <div style={pageStyle}>
      <div style={textStyle}>404</div>
      <div style={subTextStyle}>Page Not Found</div>
    </div>
  );
}

export default NotFound;
