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
import ConnectWalletPage from "./pages/ConnectWalletPage";
import MintedConversationViewer from "./pages/MintedConversationViewer";

function App() {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  const Layout = isDesktop ? DesktopLayout : MobileLayout;

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/chat/new" replace />} />
            <Route path="chat" element={<Navigate to="/chat/new" replace />} />
            <Route path="chat/:id" element={<ChatPage />} />
            <Route path="mint-history" element={<MintHistory />} />
            <Route
              path="mint-history/:id"
              element={<MintedConversationViewer />}
            />
            <Route path="connect-wallet" element={<ConnectWalletPage />} />
          </Route>
        </Routes>
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
