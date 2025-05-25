import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import OnmapList from "./components/OnmapList";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./css/style.css";

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/onmap"
                element={
                  <ProtectedRoute>
                    <OnmapList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
