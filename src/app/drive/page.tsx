'use client';
import DriveIntegration from '../../components/ui/DriveIntegration';
import MobileNavigation from '../../components/ui/MobileNavigation';
import { Blueprint } from '../../types';

export default function DrivePage() {
  const handleBlueprintSelect = (blueprint: Blueprint) => {
    console.log('Selected blueprint:', blueprint);
    // Navigate to blueprint or open in editor
  };

  const handleBlueprintDownload = (blueprint: Blueprint) => {
    console.log('Downloading blueprint:', blueprint);
    // Trigger download
  };

  const handleBlueprintDelete = (blueprintId: string) => {
    console.log('Deleting blueprint:', blueprintId);
    // Confirm and delete
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation />
      
      <main className="pt-16 md:pt-0">
        <DriveIntegration
          onBlueprintSelect={handleBlueprintSelect}
          onBlueprintDownload={handleBlueprintDownload}
          onBlueprintDelete={handleBlueprintDelete}
        />
      </main>
    </div>
  );
} 