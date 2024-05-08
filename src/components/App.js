import { Suspense } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavBar from "./views/NavBar/NavBar";
import MainPage from "./views/MainPage/MainPage";
import Header from "./views/Header/Header";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ display: "flex", flex: 1 }}>
        <NavBar />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <Header />
          <div style={{ flex: 1, padding: "20px 20px 20px" }}>
            <Routes>
              <Route path="/" element={<MainPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
