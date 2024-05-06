import { Suspense } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavBar from "./views/NavBar/NavBar";
import MainPage from "./views/MainPage/MainPage";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ display: "flex", height: "100vh" }}>
        {" "}
        {/* Set display to flex to align items side by side */}
        <NavBar />
        <div style={{ flex: 1, padding: "69px 20px 20px" }}>
          {" "}
          {/* Flexible space for MainPage, adjusted padding */}
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
