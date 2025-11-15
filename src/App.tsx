import { useMediaQuery } from "react-responsive";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DesktopLayout from "./components/layout/DesktopLayout";
import MobileLayout from "./components/layout/MobileLayout";

import ChatPage from "./pages/ChatPage";
import MintHistory from "./pages/MintHistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  return (
    <>
      <Router>
        {isDesktop ? (
          <Routes>
            <Route path="/" element={<DesktopLayout />}>
              {/* All base paths redirect to the canonical new chat URL */}
              <Route index element={<Navigate to="/chat/new" replace />} />
              <Route
                path="chat"
                element={<Navigate to="/chat/new" replace />}
              />
              <Route path="chat/:id" element={<ChatPage />} />
              <Route path="mint-history" element={<MintHistory />} />
            </Route>
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<MobileLayout />}>
              {/* Mobile also defaults to the new chat URL */}
              <Route index element={<Navigate to="/chat/new" replace />} />
              <Route
                path="chat"
                element={<Navigate to="/chat/new" replace />}
              />
              <Route path="chat/:id" element={<ChatPage />} />
              <Route path="mint-history" element={<MintHistory />} />
            </Route>
          </Routes>
        )}
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
