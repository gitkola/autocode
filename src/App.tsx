import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CodeEditor from "./components/CodeEditor";
import FileExplorer from "./components/FileExplorer";
import Settings from "./components/Settings";
import Project from "./components/Project";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="code-editor" element={<CodeEditor />} />
          <Route path="file-explorer" element={<FileExplorer />} />
          <Route path="settings" element={<Settings />} />
          <Route path="project/:projectId" element={<Project />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
