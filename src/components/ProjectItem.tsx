import React, { useState, useRef } from 'react';
import { ThreeDotsIcon, DeleteIcon } from './Icons';
import { Project } from '../store/projectsSlice';

const ProjectItem: React.FC<{ project: Project, isActive: boolean, onSelectProject: (projectId: string) => void, onDeleteProject: (projectId: string) => void }> = ({ project, isActive, onSelectProject, onDeleteProject }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsPopoverOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onSelectProject(project.id)}
        className={`flex items-center w-full h-[40px] px-4 py-2 rounded-md text-sm ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
      >
        {project.name}
      </button>
      <div className="relative">
        <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="h-[40px] px-4 py-2 rounded-md hover:bg-gray-700">
          <ThreeDotsIcon size={16} />
        </button>
        {isPopoverOpen && (
          <div ref={popoverRef} className="absolute right-0 -mt-16 bg-white shadow-lg rounded-md z-10">
            <button
              onClick={() => {
                onDeleteProject(project.id);
                setIsPopoverOpen(!isPopoverOpen);
              }}
              className="flex items-center w-full px-4 py-2 text-sm rounded-md text-red-700 hover:bg-gray-200"
            >
              <DeleteIcon size={16} className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
