'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
  gray: 'text-gray-400'
};

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className={`mt-2 text-sm ${color === 'white' ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Skeleton loading component for content placeholders
interface SkeletonProps {
  type?: 'text' | 'title' | 'paragraph' | 'card' | 'avatar' | 'button';
  lines?: number;
  className?: string;
}

export function Skeleton({ type = 'text', lines = 1, className = '' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  switch (type) {
    case 'title':
      return (
        <div className={`h-6 ${baseClasses} ${className}`} style={{ width: '60%' }} />
      );

    case 'paragraph':
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`h-4 ${baseClasses} ${className}`}
              style={{ width: i === lines - 1 ? '80%' : '100%' }}
            />
          ))}
        </div>
      );

    case 'card':
      return (
        <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
          <div className="space-y-3">
            <div className={`h-5 ${baseClasses}`} style={{ width: '70%' }} />
            <div className={`h-4 ${baseClasses}`} style={{ width: '100%' }} />
            <div className={`h-4 ${baseClasses}`} style={{ width: '90%' }} />
            <div className={`h-4 ${baseClasses}`} style={{ width: '60%' }} />
          </div>
        </div>
      );

    case 'avatar':
      return (
        <div className={`w-10 h-10 ${baseClasses} rounded-full ${className}`} />
      );

    case 'button':
      return (
        <div className={`h-10 ${baseClasses} rounded-md ${className}`} style={{ width: '120px' }} />
      );

    default:
      return (
        <div className={`h-4 ${baseClasses} ${className}`} style={{ width: '100%' }} />
      );
  }
}

// Loading overlay for components
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, children, text, className = '' }: LoadingOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
}

// Page loading component
interface PageLoadingProps {
  title?: string;
  subtitle?: string;
}

export function PageLoading({ title = 'Loading...', subtitle }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// Progress bar component
interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  size = 'md',
  color = 'blue',
  showPercentage = false,
  className = ''
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
} 