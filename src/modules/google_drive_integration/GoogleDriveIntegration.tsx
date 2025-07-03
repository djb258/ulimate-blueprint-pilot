'use client';

import React, { useState, useEffect } from 'react';
import { GoogleDriveService } from './googleDriveService';

interface GoogleDriveIntegrationProps {
  onBlueprintSaved?: (filePath: string) => void;
  onBlueprintLoaded?: (blueprint: any) => void;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
}

export default function GoogleDriveIntegration({ onBlueprintSaved, onBlueprintLoaded }: GoogleDriveIntegrationProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blueprintFiles, setBlueprintFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [commanderApproval, setCommanderApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const driveService = new GoogleDriveService();

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await driveService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        loadBlueprintFiles();
      }
    } catch (err) {
      setError('Failed to check authentication status');
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await driveService.authenticate();
      setIsAuthenticated(true);
      await loadBlueprintFiles();
      setSuccess('Successfully authenticated with Google Drive');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await driveService.logout();
      setIsAuthenticated(false);
      setBlueprintFiles([]);
      setSelectedFile(null);
      setSuccess('Successfully logged out');
    } catch (err) {
      setError('Logout failed');
    }
  };

  const loadBlueprintFiles = async () => {
    setIsLoading(true);
    try {
      const files = await driveService.listBlueprintFiles();
      setBlueprintFiles(files);
    } catch (err) {
      setError('Failed to load blueprint files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBlueprint = async (blueprintData: any, fileName: string) => {
    if (!commanderApproval) {
      setError('Commander approval required before saving to Drive');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const filePath = await driveService.saveBlueprint(blueprintData, fileName);
      setSuccess(`Blueprint saved to Drive: ${filePath}`);
      onBlueprintSaved?.(filePath);
      await loadBlueprintFiles(); // Refresh file list
    } catch (err) {
      setError('Failed to save blueprint to Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadBlueprint = async (file: DriveFile) => {
    setIsLoading(true);
    setError(null);
    try {
      const blueprint = await driveService.loadBlueprint(file.id);
      setSelectedFile(file);
      onBlueprintLoaded?.(blueprint);
      setSuccess(`Loaded blueprint: ${file.name}`);
    } catch (err) {
      setError('Failed to load blueprint from Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlueprint = async (fileId: string) => {
    if (!commanderApproval) {
      setError('Commander approval required before deleting from Drive');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await driveService.deleteBlueprint(fileId);
      setSuccess('Blueprint deleted from Drive');
      await loadBlueprintFiles(); // Refresh file list
    } catch (err) {
      setError('Failed to delete blueprint from Drive');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Google Drive Integration</h2>
          <p className="text-gray-600 mb-8">
            Connect to Google Drive to save and load blueprint specifications securely.
            Commander authentication required for all operations.
          </p>
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`px-8 py-4 rounded-lg font-medium text-lg ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Connecting...' : 'Connect to Google Drive'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Google Drive Integration</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Disconnect
        </button>
      </div>

      {/* Commander Approval Section */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Commander Approval Required</h3>
        <p className="text-yellow-700 mb-3">
          All file operations (save, delete) require commander approval for security.
        </p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={commanderApproval}
            onChange={(e) => setCommanderApproval(e.target.checked)}
            className="mr-2"
          />
          <span className="text-yellow-800">I approve file operations on Google Drive</span>
        </label>
      </div>

      {/* Blueprint Files List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Blueprint Files</h3>
          <button
            onClick={loadBlueprintFiles}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {blueprintFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No blueprint files found in Drive</p>
            <p className="text-sm mt-2">Save a blueprint to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {blueprintFiles.map((file) => (
              <div
                key={file.id}
                className={`p-4 border rounded-lg ${
                  selectedFile?.id === file.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{file.name}</h4>
                    <p className="text-sm text-gray-500">
                      Modified: {new Date(file.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoadBlueprint(file)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-300"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteBlueprint(file.id)}
                      disabled={isLoading || !commanderApproval}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:bg-gray-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Save Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Save Blueprint</h3>
        <p className="text-gray-600 mb-3">
          Save the current blueprint to Google Drive (requires commander approval).
        </p>
        <button
          onClick={() => {
            // This would be called from the parent component with actual blueprint data
            const sampleBlueprint = {
              blueprint_id: 'example_blueprint',
              version: 'v1.0.0',
              doctrine_reference: 'nuclear_doctrine_v1.2',
              timestamp: new Date().toISOString()
            };
            handleSaveBlueprint(sampleBlueprint, `final_blueprint_v1.0.0_${Date.now()}.yaml`);
          }}
          disabled={isLoading || !commanderApproval}
          className={`px-4 py-2 rounded-lg font-medium ${
            isLoading || !commanderApproval
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Current Blueprint'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Drive Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Drive Integration Info</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Blueprint files are saved to: <code>/Blueprints/</code> folder</li>
          <li>• Files are organized by version and timestamp</li>
          <li>• Commander approval required for all file operations</li>
          <li>• Files can be loaded for review or continued work</li>
        </ul>
      </div>
    </div>
  );
} 