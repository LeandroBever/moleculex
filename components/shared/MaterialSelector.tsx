import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Molecule, OlfactiveFamily } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface MaterialSelectorProps {
    molecules: Molecule[];
    value: string;
    onChange: (moleculeId: string) => void;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({ molecules, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectedMolecule = useMemo(() => molecules.find(m => m.id === value), [molecules, value]);

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (moleculeId: string) => {
        onChange(moleculeId);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-end items-center space-x-2 text-right bg-transparent p-0"
            >
                {selectedMolecule ? (
                    <>
                        <span className="truncate text-white text-base">{selectedMolecule.name}</span>
                        <span 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: CATEGORY_HEX_COLORS[selectedMolecule.olfactiveFamily] }}
                        ></span>
                    </>
                ) : (
                    <span className="text-gray-500 text-base">Select a material...</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-1 w-72 right-0 bg-[#1C1C1C] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <ul className="p-1">
                        {Object.values(OlfactiveFamily).map(family => {
                            const familyMolecules = groupedMolecules[family];
                            if (!familyMolecules || familyMolecules.length === 0) return null;
                            return (
                                <li key={family}>
                                    <details open className="group">
                                        <summary className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#2c2c2c] transition-colors">
                                            <div className="flex items-center space-x-2">
                                                <span 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: CATEGORY_HEX_COLORS[family] }}
                                                ></span>
                                                <span className="font-semibold text-sm text-gray-300">{family} ({familyMolecules.length})</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-500 transform transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </summary>
                                        <ul className="pl-4 mt-1 space-y-1">
                                            {familyMolecules.map(m => (
                                                <li key={m.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelect(m.id)}
                                                        className={`w-full text-left text-sm p-2 rounded-md transition-colors ${value === m.id ? 'bg-[#a89984] text-white' : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'}`}
                                                    >
                                                        {m.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MaterialSelector;