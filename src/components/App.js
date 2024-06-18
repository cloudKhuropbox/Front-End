import { Suspense, useEffect } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./views/NavBar/NavBar";
import MainPage from "./views/MainPage/MainPage";
import Header from "./views/Header/Header";
import LoginPage from "./views/LoginPage/LoginPage";
import SignupPage from "./views/SignupPage/SignupPage";
import CreateTeamPage from "./views/CreateTeamPage/CreateTeamPage";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../recoil/userAtom";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";
  const isCreateTeamPage = location.pathname === "/create-team";
  const isLoggedIn = useRecoilValue(isLoggedInState);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ display: "flex", flex: 1 }}>
        {!isLoginPage && !isSignupPage && !isCreateTeamPage && <NavBar />}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {!isLoginPage && !isSignupPage && !isCreateTeamPage && <Header />}
          <div style={{ flex: 1, padding: "20px 20px 20px" }}>
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route path="/personal" element={<MainPage />} />
                  <Route path="/team/:teamid" element={<MainPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/create-team" element={<CreateTeamPage />} />
                  <Route path="*" element={<Navigate to={"/personal"} />} />
                  <Route path="/personal/recycle-bin" element={<MainPage />} />
                  <Route
                    path="/team/:teamid/recycle-bin"
                    element={<MainPage />}
                  />
                </>
              ) : (
                <>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="*" element={<Navigate to={"/"} />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
