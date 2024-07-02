import React from "react";

const CodeEditor: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Code Editor
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Write and edit your code here
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <div className="px-4 py-5 sm:p-6">
          <textarea
            className="w-full h-64 p-2 border rounded-md"
            placeholder="Enter your code here..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
