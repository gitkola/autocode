import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Plus, Dashboard, CodeEditor, FileExplorer, Settings } from './Icons';
import { Project } from '../store/projectsSlice';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onNewProject: () => void;
  onSelectProject: (projectId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, activeProjectId, onNewProject, onSelectProject }) => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  const navItems = [
    { name: 'Dashboard', icon: Dashboard, path: '/' },
    { name: 'Code Editor', icon: CodeEditor, path: '/code-editor' },
    { name: 'File Explorer', icon: FileExplorer, path: '/file-explorer' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">AutoCode</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3" size={24} />
                {item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {isProjectsExpanded ? (
                <ChevronDown className="mr-3" size={24} />
              ) : (
                <ChevronRight className="mr-3" size={24} />
              )}
              Projects
            </button>
            {isProjectsExpanded && (
              <div className="ml-4">
                <button
                  onClick={onNewProject}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Plus className="mr-3" size={16} />
                  New Project
                </button>
                <ul>
                  {projects.map((project) => (
                    <li key={project.id}>
                      <button
                        onClick={() => onSelectProject(project.id)}
                        className={`flex items-center w-full px-4 py-2 text-sm ${project.id === activeProjectId
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                      >
                        {project.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;