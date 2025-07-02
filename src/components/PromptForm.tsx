import { useState, useEffect } from 'react';
import { Prompt, Phase, PHASES } from '../utils/promptsStore';

interface PromptFormProps {
  prompt?: Prompt | null;
  onSubmit: (text: string, phase: Phase) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function PromptForm({ prompt, onSubmit, onCancel, isOpen }: PromptFormProps) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('PLAN');

  // Reset form when prompt changes (for edit mode)
  useEffect(() => {
    if (prompt) {
      setText(prompt.text);
      setPhase(prompt.phase as Phase);
    } else {
      setText('');
      setPhase('PLAN');
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim(), phase);
      setText('');
      setPhase('PLAN');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {prompt ? 'Edit Prompt' : 'Add New Prompt'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phase Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phase
            </label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value as Phase)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your prompt text..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {prompt ? 'Update' : 'Add'} Prompt
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 