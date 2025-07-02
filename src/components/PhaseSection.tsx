interface PhaseSectionProps {
  phase: string;
  status: 0 | 1 | 2; // 0 = not started, 1 = in progress, 2 = completed
}

const statusMap = [
  { color: 'bg-red-400', label: 'Not Started', icon: '🔴' },
  { color: 'bg-yellow-400', label: 'In Progress', icon: '🟡' },
  { color: 'bg-green-500', label: 'Completed', icon: '🟢' },
];

export default function PhaseSection({ phase, status }: PhaseSectionProps) {
  const { color, label, icon } = statusMap[status];
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
      {/* Status Indicator */}
      <span className={`w-8 h-8 flex items-center justify-center text-xl ${color} rounded-full`}>
        {icon}
      </span>
      <div className="flex-1">
        <div className="font-semibold text-lg">{phase}</div>
        <div className="text-sm text-gray-500">{label}</div>
        {/* Placeholder for future phase content */}
        <div className="mt-2 text-gray-400 italic text-xs">
          [Phase content placeholder]
        </div>
      </div>
    </div>
  );
} 