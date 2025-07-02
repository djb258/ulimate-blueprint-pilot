'use client';

import { useState } from 'react';
import { reengineeringStore, RepoInfo } from '../utils/reengineeringStore';

interface RepoInputFormProps {
  onRepoAdded: (repo: RepoInfo) => void;
}

export default function RepoInputForm({ onRepoAdded }: RepoInputFormProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic validation
      if (!url.trim()) {
        throw new Error('Repository URL is required');
      }

      if (!name.trim()) {
        throw new Error('Repository name is required');
      }

      // Validate GitHub URL format (basic check)
      const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/;
      if (!githubUrlPattern.test(url.trim())) {
        throw new Error('Please enter a valid GitHub repository URL');
      }

      // Add repo to store
      const newRepo = reengineeringStore.addRepo(url.trim(), name.trim(), description.trim());
      
      // Reset form
      setUrl('');
      setName('');
      setDescription('');
      
      // Notify parent component
      onRepoAdded(newRepo);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add Repository for Analysis
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Repository URL *
          </label>
          <input
            type="url"
            id="repo-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the full GitHub repository URL (e.g., https://github.com/username/repo-name)
          </p>
        </div>

        <div>
          <label htmlFor="repo-name" className="block text-sm font-medium text-gray-700 mb-1">
            Repository Name *
          </label>
          <input
            type="text"
            id="repo-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-awesome-app"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="repo-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="repo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the repository..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Repository'}
          </button>
          
          <div className="text-xs text-gray-500">
            <p>💡 Future: Local directory selection will be available</p>
          </div>
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Repository will be added to your analysis workspace</li>
          <li>• You&apos;ll be able to walk through each phase of the blueprint</li>
          <li>• Document findings, gaps, and recommendations for each phase</li>
          <li>• Generate a comprehensive gap report at the end</li>
        </ul>
      </div>
    </div>
  );
} 