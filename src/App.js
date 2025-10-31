import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ArchivePage from "./pages/ArchivePage";
import ClientPage from "./pages/ClientPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/client/:id" element={<ClientPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
