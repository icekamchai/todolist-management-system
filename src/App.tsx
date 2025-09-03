import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";

import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { ConfigProvider, theme } from "antd";
function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: "#2dd4bf",
      colorBgBase: "#0f172a",
      colorLink: "#2dd4bf",
      colorLinkHover: "#5eead4",
      colorTextBase: "#e2e8f0",
      colorTextSecondary: "#94a3b8",
    },
    components: {
      Input: {
        colorBgContainer: "#1e293b",
        colorText: "#e2e8f0",
        colorBorder: "#475569",
        activeBorderColor: "#2dd4bf",
        hoverBorderColor: "#5eead4",
      },
      Select: {
        colorBgContainer: "#1e293b",
        colorText: "#e2e8f0",
        colorBorder: "#475569",
        activeBorderColor: "#2dd4bf",
        hoverBorderColor: "#5eead4",
      },
      Modal: {
        colorBgElevated: "#1f2937",
        colorTextHeading: "#e2e8f0",
      },
      Card: {
        colorBgContainer: "#1e293b",
        colorTextHeading: "#e2e8f0",
        colorBorderSecondary: "#374151",
      },
      Form: {
        colorTextDescription: "#94a3b8",
      },
    },
  };
  return (
    <ConfigProvider theme={darkTheme}>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
          />

          <Route
            path="/*"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
