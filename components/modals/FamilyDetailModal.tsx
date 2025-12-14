
import React, { useState, useMemo } from 'react';
import { Molecule, OlfactiveFamily } from '../../types';
import BaseModal from '../ui/BaseModal';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface FamilyDetailModalProps {
    family: OlfactiveFamily;
    molecules: Molecule[];
    onClose: () => void;
    onSelectMolecule: (id: string) => void;
}

const FamilyDetailModal: React.FC<FamilyDetailModalProps> = ({ family, molecules, onClose, onSelectMolecule }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMolecules = useMemo(() => {
        return molecules.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [molecules, searchTerm]);

    const handleSelect = (id: string) => {
        onSelectMolecule(id);
        onClose();
    };

    return (
        <BaseModal title="" onClose={onClose} size="md">
            <div className="flex flex-col h-[60vh]">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-700 flex-shrink-0">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: CATEGORY_HEX_COLORS[family] }}></span>
                    <h2 className="text-xl font-bold text-white">{family} Materials</h2>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search in family..."
                    className="my-3 w-full bg-[#111] border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a89984] text-sm flex-shrink-0"
                />
                <ul className="flex-grow overflow-y-auto pr-2 space-y-1">
                    {filteredMolecules.map(molecule => (
                        <li key={molecule.id}>
                            <button 
                                onClick={() => handleSelect(molecule.id)} 
                                className="w-full text-left p-2 rounded-md text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors text-sm"
                            >
                                {molecule.name}
                            </button>
                        </li>
                    ))}
                    {filteredMolecules.length === 0 && (
                        <li className="text-center text-gray-500 py-4 text-sm">No materials found.</li>
                    )}
                </ul>
            </div>
        </BaseModal>
    );
};

export default FamilyDetailModal;
