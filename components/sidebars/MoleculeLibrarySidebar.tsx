
import React, { useState, useMemo, useEffect } from 'react';
import { Molecule } from '../../types';
import MoleculeList from '../MoleculeList';

interface MoleculeLibrarySidebarProps {
    allMolecules: Molecule[];
    activeMoleculeId: string | null;
    onSelectMolecule: (id: string) => void;
    onAddNewMolecule: () => void;
}

const MoleculeLibrarySidebar: React.FC<MoleculeLibrarySidebarProps> = ({
    allMolecules,
    activeMoleculeId,
    onSelectMolecule,
    onAddNewMolecule,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search term to prevent lag while typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Optimized Deep Search filtering
    const filteredMolecules = useMemo(() => {
        if (!searchTerm) return allMolecules;
        const term = searchTerm.toLowerCase();
        
        return allMolecules.filter(m => {
            // 1. Check Name
            if (m.name.toLowerCase().includes(term)) return true;
            
            // 2. Check Scent DNA (Facets)
            const hasFacet = Object.keys(m.scentDNA).some(facet => facet.toLowerCase().includes(term));
            if (hasFacet) return true;

            // 3. Check Roles
            const hasRole = m.roles.some(role => role.toLowerCase().includes(term));
            if (hasRole) return true;

            // 4. Check Functional Roles
            const hasFunctionalRole = m.functionalRole?.some(role => role.toLowerCase().includes(term));
            if (hasFunctionalRole) return true;

             // 5. Check CAS (useful for technical search)
             if (m.casNumber && m.casNumber.includes(term)) return true;

            return false;
        });
    }, [allMolecules, searchTerm]);

    return (
        <aside className="fixed inset-y-0 left-0 w-80 h-full bg-gray-50 dark:bg-[#111111] border-r border-gray-200 dark:border-gray-800 p-4 hidden md:flex flex-col z-20 transition-colors duration-300">
            <div className="flex-shrink-0 pt-12">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Library</h2>
                </div>
                <input
                    type="text"
                    placeholder="Search name, facet, role..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a89984] transition-colors"
                />
            </div>
            <div className="flex-grow overflow-y-auto pr-2 mt-4 custom-scrollbar">
                <MoleculeList
                    molecules={filteredMolecules}
                    activeMoleculeId={activeMoleculeId}
                    onSelectMolecule={onSelectMolecule}
                    hideEmptyFamilies={!!searchTerm}
                />
            </div>
            <div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <button
                    onClick={onAddNewMolecule}
                    className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-transparent text-gray-700 dark:text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm flex items-center justify-center space-x-2 shadow-sm dark:shadow-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Add New Molecule</span>
                </button>
            </div>
        </aside>
    );
};

export default React.memo(MoleculeLibrarySidebar);
