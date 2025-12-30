
import React, { useMemo } from 'react';
import { Molecule, OlfactiveFamily } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { supabase } from '../lib/supabase';

interface MoleculeListProps {
    molecules: Molecule[];
    activeMoleculeId: string | null;
    onSelectMolecule: (id: string) => void;
    hideEmptyFamilies?: boolean;
}

const MoleculeList: React.FC<MoleculeListProps> = ({ molecules, activeMoleculeId, onSelectMolecule, hideEmptyFamilies = false }) => {

    const groupedMolecules = useMemo(() => {
        return molecules.reduce((acc, molecule) => {
            const family = molecule.olfactiveFamily;
            if (!acc[family]) {
                acc[family] = [];
            }
            acc[family].push(molecule);
            return acc;
        }, {} as Record<OlfactiveFamily, Molecule[]>);
    }, [molecules]);

    const sortedFamilies = useMemo(() => Object.values(OlfactiveFamily).sort((a, b) => a.localeCompare(b)), []);

    return (
        <div className="space-y-2">
            {sortedFamilies.map(family => {
                const familyMolecules = groupedMolecules[family] || [];
                
                // Hide empty families if we are searching (hideEmptyFamilies is true)
                if (hideEmptyFamilies && familyMolecules.length === 0) return null;

                return (
                    <details key={family} open={!!hideEmptyFamilies} className="group">
                        <summary className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2c2c2c] transition-colors">
                            <div className="flex items-center space-x-2">
                                <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[family as OlfactiveFamily]}`}></span>
                                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{family}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5">{familyMolecules.length}</span>
                                <svg className="w-4 h-4 text-gray-500 transform transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </summary>
                        <ul className="pl-4 mt-1 space-y-1">
                            {familyMolecules.map(molecule => (
                                <li key={molecule.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onSelectMolecule(molecule.id);
                                        }}
                                        className={`block text-sm p-2 rounded-md transition-colors ${activeMoleculeId === molecule.id ? 'bg-[#a89984] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-gray-200'}`}
                                    >
                                        {molecule.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>
                );
            })}
        </div>
    );
};

export default React.memo(MoleculeList);
