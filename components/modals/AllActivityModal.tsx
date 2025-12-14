


import React from 'react';
import { ActivityEvent, Molecule, Formula, ScentNote } from '../../types';
import BaseModal from '../ui/BaseModal';

interface AllActivityModalProps {
    feed: ActivityEvent[];
    onSelectMolecule: (id: string) => void;
    onSelectFormula: (id: string) => void;
    allMolecules: Molecule[];
    onClose: () => void;
}

const ActivityItem: React.FC<{ event: ActivityEvent, allMolecules: Molecule[], onSelectMolecule: (id: string) => void, onSelectFormula: (id: string) => void }> = ({ event, allMolecules, onSelectMolecule, onSelectFormula }) => {
    const getEventDetails = () => {
        switch (event.type) {
            case 'molecule':
                const molecule = event.data as Molecule;
                return { 
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="7" cy="7" r="3" /><circle cx="15" cy="10" r="6" /><circle cx="9" cy="17" r="2" /></svg>,
                    title: molecule.name,
                    description: "New material added",
                    onClick: () => onSelectMolecule(molecule.id)
                };
            case 'formula':
                const formula = event.data as Formula;
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
                    title: formula.name,
                    description: "Formula created",
                    onClick: () => onSelectFormula(formula.id)
                };
            case 'note':
                const note = event.data as ScentNote;
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
                    title: `Note on ${allMolecules.find(m => m.id === note.moleculeId)?.name || '...'}`,
                    description: `"${note.text.substring(0, 30)}..."`,
                    onClick: () => onSelectMolecule(note.moleculeId)
                };
            default:
                return { icon: null, title: 'Unknown Event', description: '' };
        }
    };

    const { icon, title, description, onClick } = getEventDetails();

    return (
        <li>
            <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#a89984]/20 transition-colors">
                <div className="flex-shrink-0 bg-[#a89984] rounded-full p-2 text-white">
                    {icon}
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-200">{title}</p>
                    <p className="text-xs text-gray-500">{description} - <span className="italic">{new Date(event.date).toLocaleDateString()}</span></p>
                </div>
            </a>
        </li>
    );
};

const AllActivityModal: React.FC<AllActivityModalProps> = ({ feed, onSelectMolecule, onSelectFormula, allMolecules, onClose }) => {
    return (
        <BaseModal title="All Activity" onClose={onClose} size="lg">
            <div className="max-h-[70vh] overflow-y-auto pr-2">
                <ul className="space-y-3">
                    {feed.map(event => (
                        <ActivityItem 
                            key={`${event.type}-${event.data.id}`}
                            event={event}
                            allMolecules={allMolecules}
                            onSelectMolecule={onSelectMolecule}
                            onSelectFormula={onSelectFormula}
                        />
                    ))}
                </ul>
            </div>
        </BaseModal>
    );
};

export default AllActivityModal;
