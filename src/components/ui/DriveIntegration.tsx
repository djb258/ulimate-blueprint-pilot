'use client';

import React, { useState, useEffect } from 'react';
import { Blueprint } from '../../types';

interface DriveIntegrationProps {
  onBlueprintSelect?: (blueprint: DriveBlueprint) => void;
  onBlueprintDownload?: (blueprint: DriveBlueprint) => void;
  onBlueprintDelete?: (blueprintId: string) => void;
}

interface DriveBlueprint extends Blueprint {
  driveId: string;
  lastModified: Date;
  size: number;
  isShared: boolean;
  owner: string;
  complexity: 'simple' | 'moderate' | 'complex';
  metadata: {
    author: string;
    version: string;
    tags: string[];
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedTotalTime: number;
    targetTechnologies: string[];
  };
}

export default function DriveIntegration({ 
  onBlueprintSelect, 
  onBlueprintDownload, 
  onBlueprintDelete 
}: DriveIntegrationProps) {
  const [blueprints, setBlueprints] = useState<DriveBlueprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'in_progress' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'status'>('modified');
  const [files, setFiles] = useState<Array<{
    id: string;
    name: string;
    mimeType: string;
    size: number;
    createdTime: string;
    modifiedTime: string;
  }>>([]);
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    name: string;
    mimeType: string;
    size: number;
    createdTime: string;
    modifiedTime: string;
  } | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockBlueprints: DriveBlueprint[] = [
      {
        id: '1',
        name: 'E-commerce Platform Blueprint',
        description: 'Complete blueprint for modern e-commerce platform',
        driveId: 'drive_1',
        lastModified: new Date('2024-01-15'),
        size: 245760,
        isShared: true,
        owner: 'commander@example.com',
        status: 'approved',
        phases: [],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        complexity: 'complex',
        metadata: {
          author: 'commander@example.com',
          version: '1.0.0',
          tags: ['e-commerce', 'platform'],
          complexity: 'complex',
          estimatedTotalTime: 480,
          targetTechnologies: ['Next.js', 'TypeScript', 'Tailwind CSS']
        }
      },
      {
        id: '2',
        name: 'API Gateway Design',
        description: 'Microservices API gateway architecture',
        driveId: 'drive_2',
        lastModified: new Date('2024-01-14'),
        size: 184320,
        isShared: false,
        owner: 'commander@example.com',
        status: 'in_progress',
        phases: [],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-14'),
        complexity: 'moderate',
        metadata: {
          author: 'commander@example.com',
          version: '0.8.0',
          tags: ['api', 'gateway', 'microservices'],
          complexity: 'moderate',
          estimatedTotalTime: 360,
          targetTechnologies: ['Node.js', 'Express', 'Docker']
        }
      },
      {
        id: '3',
        name: 'Data Pipeline Blueprint',
        description: 'Real-time data processing pipeline',
        driveId: 'drive_3',
        lastModified: new Date('2024-01-13'),
        size: 153600,
        isShared: true,
        owner: 'commander@example.com',
        status: 'draft',
        phases: [],
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-13'),
        complexity: 'simple',
        metadata: {
          author: 'commander@example.com',
          version: '0.5.0',
          tags: ['data', 'pipeline', 'real-time'],
          complexity: 'simple',
          estimatedTotalTime: 240,
          targetTechnologies: ['Python', 'Apache Kafka', 'Redis']
        }
      }
    ];

    setTimeout(() => {
      setBlueprints(mockBlueprints);
      setIsLoading(false);
      setIsConnected(true);
    }, 1000);
  }, []);

  const filteredBlueprints = blueprints
    .filter(blueprint => {
      const matchesSearch = blueprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blueprint.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || blueprint.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'modified':
          return b.lastModified.getTime() - a.lastModified.getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Complete';
      case 'in_progress': return 'In Progress';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const handleConnect = () => {
    setIsLoading(true);
    // Mock connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect to Google Drive</h2>
          <p className="text-gray-600 mb-6">
            Connect your Google Drive to access and manage your blueprint specifications.
          </p>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : 'Connect Google Drive'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Google Drive Blueprints</h1>
              <p className="text-gray-600">Manage and access your blueprint specifications</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Connected
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search blueprints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'approved' | 'in_progress' | 'draft')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'modified' | 'status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="modified">Sort by Modified</option>
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blueprints List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blueprints...</p>
          </div>
        ) : filteredBlueprints.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blueprints found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first blueprint to get started'}
            </p>
          </div>
        ) : (
          filteredBlueprints.map((blueprint) => (
            <div key={blueprint.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {blueprint.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blueprint.status)}`}>
                      {getStatusText(blueprint.status)}
                    </span>
                    {blueprint.isShared && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        Shared
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{blueprint.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Size: {formatFileSize(blueprint.size)}</span>
                    <span>Modified: {blueprint.lastModified.toLocaleDateString()}</span>
                    <span>Owner: {blueprint.owner}</span>
                    <span>Complexity: {blueprint.complexity}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onBlueprintSelect?.(blueprint)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {blueprint.status === 'approved' ? 'View' : 'Resume'}
                  </button>
                  
                  {blueprint.status === 'approved' && (
                    <button
                      onClick={() => onBlueprintDownload?.(blueprint)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Download
                    </button>
                  )}
                  
                  <button
                    onClick={() => onBlueprintDelete?.(blueprint.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => onBlueprintSelect?.(blueprint)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {blueprint.status === 'approved' ? 'View' : 'Resume'}
                  </button>
                  
                  {blueprint.status === 'approved' && (
                    <button
                      onClick={() => onBlueprintDownload?.(blueprint)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Download
                    </button>
                  )}
                  
                  <button
                    onClick={() => onBlueprintDelete?.(blueprint.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredBlueprints.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredBlueprints.length} of {blueprints.length} blueprints
            </span>
            <span>
              {blueprints.filter(b => b.status === 'approved').length} approved
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 