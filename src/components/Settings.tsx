import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  setTheme,
  setCodeAutoSave,
  setOpenAISettings,
  setAnthropicSettings,
} from "../store/settingsSlice";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Settings
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Configure your AutoCode preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          {["General", "OpenAI", "Anthropic"].map((tab) => (
            <button
              key={tab.toLowerCase()}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`${activeTab === tab.toLowerCase()
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="px-4 py-5 sm:p-6">
        {activeTab === "general" && (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Theme</dt>
              <dd className="mt-1">
                <select
                  value={settings.general.theme}
                  onChange={(e) =>
                    dispatch(
                      setTheme(e.target.value as "light" | "dark" | "system"),
                    )
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Code Auto-Save
              </dt>
              <dd className="mt-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.general.codeAutoSave}
                    onChange={(e) =>
                      dispatch(setCodeAutoSave(e.target.checked))
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    Enable auto-save
                  </span>
                </div>
              </dd>
            </div>
          </dl>
        )}

        {activeTab === "openai" && (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                OpenAI API Key
              </dt>
              <dd className="mt-1">
                <input
                  type="password"
                  value={settings.openai.apiKey}
                  onChange={(e) =>
                    dispatch(setOpenAISettings({ apiKey: e.target.value }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your OpenAI API key"
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                OpenAI Model
              </dt>
              <dd className="mt-1">
                <select
                  value={settings.openai.model}
                  onChange={(e) =>
                    dispatch(setOpenAISettings({ model: e.target.value }))
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
                  <option value="gpt-3.5-turbo-16k">GPT-3.5-turbo-16k</option>
                </select>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Temperature</dt>
              <dd className="mt-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.openai.temperature}
                  onChange={(e) =>
                    dispatch(
                      setOpenAISettings({
                        temperature: parseFloat(e.target.value),
                      }),
                    )
                  }
                  className="w-full mr-4"
                />
                <span>{settings.openai.temperature.toFixed(1)}</span>
              </dd>
            </div>
          </dl>
        )}

        {activeTab === "anthropic" && (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Anthropic API Key
              </dt>
              <dd className="mt-1">
                <input
                  type="password"
                  value={settings.anthropic.apiKey}
                  onChange={(e) =>
                    dispatch(setAnthropicSettings({ apiKey: e.target.value }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your Anthropic API key"
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Anthropic Model
              </dt>
              <dd className="mt-1">
                <select
                  value={settings.anthropic.model}
                  onChange={(e) =>
                    dispatch(setAnthropicSettings({ model: e.target.value }))
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="claude-2">claude-2</option>
                  <option value="claude-instant-1">claude-instant-1</option>
                </select>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Max Tokens</dt>
              <dd className="mt-1">
                <input
                  type="number"
                  value={settings.anthropic.maxTokens}
                  onChange={(e) =>
                    dispatch(
                      setAnthropicSettings({
                        maxTokens: parseInt(e.target.value),
                      }),
                    )
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter max tokens"
                />
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
};

export default Settings;
