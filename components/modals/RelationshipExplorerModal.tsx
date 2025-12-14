
import React, { useState, useMemo } from 'react';
import { Molecule } from '../../types';
import BaseModal from '../ui/BaseModal';
import ScentDNARadarChart from '../charts/ScentDNARadarChart';
import VolatilityDoughnutChart from '../charts/VolatilityDoughnutChart';

interface RelationshipExplorerModalProps {
    molecules: Molecule[];
    onClose: () => void;
}

const RelationshipExplorerModal: React.FC<RelationshipExplorerModalProps> = ({ molecules, onClose }) => {
    const [activeTab, setActiveTab] = useState<'harmony' | 'accordBuilder'>('accordBuilder');

    const HarmonyTab = () => (
      <div className="text-center p-8">
        <h3 className="text-lg text-white">Harmony & Contrast</h3>
        <p className="text-gray-500">Feature coming soon. Select a molecule to see complementary and contrasting materials.</p>
      </div>
    );

    const AccordBuilderTab = () => {
        const [accordMolecules, setAccordMolecules] = useState<({ molecule: Molecule; percentage: number })[]>([]);

        const addMoleculeToAccord = (moleculeId: string) => {
            if (accordMolecules.length >= 5 || accordMolecules.find(am => am.molecule.id === moleculeId)) return;
            const molecule = molecules.find(m => m.id === moleculeId);
            if (molecule) {
                setAccordMolecules([...accordMolecules, { molecule, percentage: 20 }]);
            }
        };

        const updatePercentage = (index: number, percentage: number) => {
            const newAccord = [...accordMolecules];
            newAccord[index].percentage = percentage;
            setAccordMolecules(newAccord);
        };
        
        const removeMolecule = (index: number) => {
            setAccordMolecules(accordMolecules.filter((_, i) => i !== index));
        };

        const combinedScentDNA = useMemo(() => {
            const dna: Record<string, number> = {};
            const totalPercentage = accordMolecules.reduce((sum, am) => sum + am.percentage, 0) || 1;
            accordMolecules.forEach(({ molecule, percentage }) => {
                for (const facet in molecule.scentDNA) {
                    dna[facet] = (dna[facet] || 0) + molecule.scentDNA[facet] * (percentage / totalPercentage);
                }
            });
            return dna;
        }, [accordMolecules]);

        const volatilityData = useMemo(() => {
            const data = { top: 0, heart: 0, base: 0 };
            const totalPercentage = accordMolecules.reduce((sum, am) => sum + am.percentage, 0) || 1;
            accordMolecules.forEach(({ molecule, percentage }) => {
                if (molecule.roles.includes('Top Note')) data.top += percentage;
                if (molecule.roles.includes('Heart Note')) data.heart += percentage;
                if (molecule.roles.includes('Base Note')) data.base += percentage;
            });
             // Normalize to 100%
            const total = data.top + data.heart + data.base || 1;
            return {
                top: (data.top / total) * 100,
                heart: (data.heart / total) * 100,
                base: (data.base / total) * 100,
            };
        }, [accordMolecules]);


        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[60vh]">
                {/* Controls */}
                <div className="flex flex-col space-y-4">
                    <select onChange={(e) => addMoleculeToAccord(e.target.value)} className="bg-[#111] border border-gray-700 rounded p-2">
                        <option>Add a molecule to accord...</option>
                        {molecules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                        {accordMolecules.map((am, index) => (
                            <div key={am.molecule.id} className="bg-[#111] p-3 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold text-white">{am.molecule.name}</span>
                                  <button onClick={() => removeMolecule(index)} className="text-red-500 hover:text-red-400 font-bold text-xl">&times;</button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="range" min="0" max="100" value={am.percentage} onChange={(e) => updatePercentage(index, parseInt(e.target.value))} className="w-full" />
                                    <span className="font-mono text-sm w-12 text-right">{am.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Visualizations */}
                <div className="flex flex-col space-y-4">
                    <div className="flex-1 bg-[#111] rounded-lg border border-gray-800 p-2">
                        <ScentDNARadarChart scentDNA={combinedScentDNA} />
                    </div>
                    <div className="flex-1 bg-[#111] rounded-lg border border-gray-800 p-2">
                        <VolatilityDoughnutChart volatilityData={volatilityData} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <BaseModal title="Relationship Explorer" onClose={onClose} size="xl">
            <div className="flex justify-center mb-6 border-b border-gray-800">
                <button onClick={() => setActiveTab('accordBuilder')} className={`px-4 py-2 font-semibold ${activeTab === 'accordBuilder' ? 'text-[#a89984] border-b-2 border-[#a89984]' : 'text-gray-500'}`}>Creative Accord Builder</button>
                <button onClick={() => setActiveTab('harmony')} className={`px-4 py-2 font-semibold ${activeTab === 'harmony' ? 'text-[#a89984] border-b-2 border-[#a89984]' : 'text-gray-500'}`}>Harmony & Contrast</button>
            </div>
            {activeTab === 'harmony' ? <HarmonyTab /> : <AccordBuilderTab />}
        </BaseModal>
    );
};

export default RelationshipExplorerModal;
