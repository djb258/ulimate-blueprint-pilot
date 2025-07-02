import PhaseSection from './PhaseSection';

// List of blueprint phases
const phases = [
  'PLAN',
  'SCAFFOLD',
  'FILE STRUCTURE',
  'TEST PLAN',
  'SECURITY PLAN',
  'PHASE GATES / PROMOTION RULES',
  'FINALIZE BLUEPRINT',
];

// Statuses: 0 = not started, 1 = in progress, 2 = completed
const phaseStatuses: (0 | 1 | 2)[] = [0, 0, 0, 0, 0, 0, 0]; // Placeholder for future logic

export default function PhaseTracker() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-6">Design Phases</h2>
      <div className="flex flex-col gap-6">
        {phases.map((phase, idx) => (
          <PhaseSection
            key={phase}
            phase={phase}
            status={phaseStatuses[idx]}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        {/* Button will be enabled when phase completion logic is added */}
        <button
          className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed"
          disabled
        >
          Proceed to next phase
        </button>
      </div>
    </section>
  );
} 