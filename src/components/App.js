import { Suspense } from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./views/NavBar/NavBar";
import MainPage from "./views/MainPage/MainPage";
import Header from "./views/Header/Header";
import LoginPage from "./views/LoginPage/LoginPage";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ display: "flex", flex: 1 }}>
        {!isLoginPage && <NavBar />}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {!isLoginPage && <Header />}
          <div style={{ flex: 1, padding: "20px 20px 20px" }}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/personal" element={<MainPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
