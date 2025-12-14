
import React, { useState, useMemo } from 'react';
import { Molecule, OlfactiveFamily } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface MoleculeLibraryViewProps {
    allMolecules: Molecule[];
    onSelectMolecule: (id: string) => void;
    onAddNewMolecule: () => void;
}

const MoleculeLibraryView: React.FC<MoleculeLibraryViewProps> = ({ allMolecules, onSelectMolecule, onAddNewMolecule }) => {
    const [selectedFamily, setSelectedFamily] = useState<OlfactiveFamily | null>(null);

    const moleculesByFamily = useMemo(() => {
        return allMolecules.reduce((acc, molecule) => {
            const family = molecule.olfactiveFamily;
            if (!acc[family]) {
                acc[family] = [];
            }
            acc[family].push(molecule);
            return acc;
        }, {} as Record<OlfactiveFamily, Molecule[]>);
    }, [allMolecules]);

    const sortedFamilies = useMemo(() => Object.values(OlfactiveFamily).sort((a, b) => a.localeCompare(b)), []);

    if (selectedFamily) {
        const familyMolecules = moleculesByFamily[selectedFamily] || [];
        return (
            <div className="animate-fade-in pt-12">
                <div className="flex items-center mb-4">
                    <button onClick={() => setSelectedFamily(null)} className="p-2 rounded-full hover:bg-gray-800 mr-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold" style={{ color: CATEGORY_HEX_COLORS[selectedFamily] }}>{selectedFamily}</h1>
                </div>
                <ul className="space-y-2">
                    {familyMolecules.map(molecule => (
                        <li key={molecule.id}>
                            <button onClick={() => onSelectMolecule(molecule.id)} className="w-full text-left p-4 bg-[#1C1C1C] border border-gray-800 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                                {molecule.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="animate-fade-in pt-12">
            <h1 className="text-3xl font-bold text-white mb-6">My Library</h1>
            <div className="grid grid-cols-2 gap-4">
                {sortedFamilies.map(family => {
                    const count = moleculesByFamily[family]?.length || 0;
                    if (count === 0) return null;
                    return (
                        <button 
                            key={family} 
                            onClick={() => setSelectedFamily(family)}
                            className="p-4 rounded-lg border text-left transition-all transform hover:scale-105"
                            style={{ 
                                backgroundColor: `${CATEGORY_HEX_COLORS[family]}20`, // transparent version
                                borderColor: CATEGORY_HEX_COLORS[family]
                            }}
                        >
                            <h2 className="font-bold text-lg text-white">{family}</h2>
                            <p className="text-sm" style={{ color: CATEGORY_HEX_COLORS[family] }}>{count} materials</p>
                        </button>
                    )
                })}
            </div>
            <div className="flex-shrink-0 pt-8 mt-8 border-t border-gray-800 space-y-2">
                <button
                    onClick={onAddNewMolecule}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-md transition-colors text-sm flex items-center justify-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>Add New Molecule</span>
                </button>
            </div>
        </div>
    );
};

export default MoleculeLibraryView;
