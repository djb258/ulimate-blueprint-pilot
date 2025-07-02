import { useState } from 'react';
import { Prompt } from '../utils/promptsStore';

interface PromptButtonProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onTrigger: (prompt: Prompt) => void;
}

export default function PromptButton({ prompt, onEdit, onDelete, onTrigger }: PromptButtonProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative group">
      {/* Main prompt button */}
      <button
        onClick={() => onTrigger(prompt)}
        className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 group-hover:border-blue-400"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="text-sm text-gray-800 font-medium truncate">
          {prompt.text}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {prompt.phase} • {new Date(prompt.updatedAt).toLocaleDateString()}
        </div>
      </button>

      {/* Action buttons */}
      {showActions && (
        <div className="absolute right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
            title="Edit prompt"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt.id);
            }}
            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            title="Delete prompt"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 