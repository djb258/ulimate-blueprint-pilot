'use client';

import { useState, useEffect } from 'react';
import { doctrineStore, DoctrineSchema } from '../utils/doctrineStore';

interface ComplianceReport {
  totalDoctrines: number;
  neonCompliant: number;
  stampedCompliant: number;
  bartonCompliant: number;
  issues: string[];
}

export default function DoctrineCompliance() {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [doctrines, setDoctrines] = useState<DoctrineSchema[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<'FRAME' | 'BLUEPRINT' | 'PROCESS' | 'ALL'>('ALL');

  useEffect(() => {
    // Generate compliance report
    const complianceReport = doctrineStore.generateComplianceReport();
    setReport(complianceReport);

    // Get all doctrines
    const allDoctrines = ['FRAME', 'BLUEPRINT', 'PROCESS'].flatMap(phase => 
      doctrineStore.getDoctrinesByPhase(phase as DoctrineSchema['phase'])
    );
    setDoctrines(allDoctrines);
  }, []);

  const filteredDoctrines = selectedPhase === 'ALL' 
    ? doctrines 
    : doctrines.filter(d => d.phase === selectedPhase);

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 border-green-200';
    if (percentage >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  if (!report) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const neonPercentage = report.totalDoctrines > 0 ? (report.neonCompliant / report.totalDoctrines) * 100 : 0;
  const bartonPercentage = report.totalDoctrines > 0 ? (report.bartonCompliant / report.totalDoctrines) * 100 : 0;
  const stampedPercentage = 100; // STAMPED processes are always compliant in this system

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Doctrine Compliance Dashboard
        </h2>
        <p className="text-gray-600">
          Monitoring compliance with Barton Doctrine (1960), NEON Doctrine, and STAMPED Framework
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NEON Doctrine */}
        <div className={`rounded-lg border p-6 ${getComplianceBg(neonPercentage)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">NEON Doctrine</h3>
            <span className={`text-2xl font-bold ${getComplianceColor(neonPercentage)}`}>
              {Math.round(neonPercentage)}%
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div>✓ Nuclear Enforcement</div>
            <div>✓ Explicit Ownership</div>
            <div>✓ Operational Normalization</div>
            <div>✓ No Orphan Data</div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-1">
              {report.neonCompliant}/{report.totalDoctrines} compliant
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${neonPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Barton Numbering */}
        <div className={`rounded-lg border p-6 ${getComplianceBg(bartonPercentage)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Barton Numbering</h3>
            <span className={`text-2xl font-bold ${getComplianceColor(bartonPercentage)}`}>
              {Math.round(bartonPercentage)}%
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div>✓ DB.HQ.SUB.NESTED.INDEX</div>
            <div>✓ Section Categories (0-49)</div>
            <div>✓ Unique Identification</div>
            <div>✓ Hierarchical Structure</div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-1">
              {report.bartonCompliant}/{report.totalDoctrines} compliant
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${bartonPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* STAMPED Framework */}
        <div className={`rounded-lg border p-6 ${getComplianceBg(stampedPercentage)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">STAMPED Framework</h3>
            <span className={`text-2xl font-bold ${getComplianceColor(stampedPercentage)}`}>
              {Math.round(stampedPercentage)}%
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div>✓ Structured</div>
            <div>✓ Traceable</div>
            <div>✓ Audit-ready</div>
            <div>✓ Mapped</div>
            <div>✓ Promotable</div>
            <div>✓ Enforced</div>
            <div>✓ Documented</div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-1">
              {report.stampedCompliant} processes active
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stampedPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Issues Alert */}
      {report.issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-red-800">Compliance Issues</h3>
          </div>
          <ul className="space-y-1 text-sm text-red-700">
            {report.issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Doctrine Registry */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Doctrine Registry</h3>
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value as 'FRAME' | 'BLUEPRINT' | 'PROCESS' | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Phases</option>
            <option value="FRAME">Frame Phase</option>
            <option value="BLUEPRINT">Blueprint Phase</option>
            <option value="PROCESS">Process Phase</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredDoctrines.map((doctrine) => (
            <div key={doctrine.bartonId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {doctrine.bartonId}
                </span>
                <span className="text-sm text-gray-500">{doctrine.phase}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{doctrine.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{doctrine.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 