import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MainPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ display: "flex", width: "100%", height: "50px" }}>
        <div>Main Page</div>
      </div>
      <div style={{ display: "flex", flexGrow: 1 }}>
        {/* Main content goes here */}
      </div>
    </div>
  );
}

export default MainPage;
