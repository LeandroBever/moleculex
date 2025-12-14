
import React, { useState, useMemo } from 'react';
import { Molecule } from '../../types';
import BaseModal from '../ui/BaseModal';
import ScentDNARadarChart from '../charts/ScentDNARadarChart';

interface TrainingGymModalProps {
    molecules: Molecule[];
    onClose: () => void;
}

const TrainingGymModal: React.FC<TrainingGymModalProps> = ({ molecules, onClose }) => {
    const [mode, setMode] = useState<'flashcard' | 'quiz'>('flashcard');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Simple shuffle function
    const shuffledMolecules = useMemo(() => [...molecules].sort(() => 0.5 - Math.random()), [molecules]);
    const currentMolecule = shuffledMolecules[currentCardIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev + 1) % shuffledMolecules.length);
    };

    const FlashcardMode = () => (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-md h-80 perspective-1000">
                <div
                    className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-[#111] border border-gray-700 rounded-lg flex items-center justify-center flex-col p-4">
                        <h3 className="text-3xl font-bold text-white">{currentMolecule.name}</h3>
                        <p className="text-gray-400 mt-2">Click to reveal details</p>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-[#1C1C1C] border border-gray-700 rounded-lg transform rotate-y-180 p-4">
                         <h4 className="text-center font-bold text-lg text-[#a89984]">{currentMolecule.olfactiveFamily}</h4>
                         <div className="h-64">
                            <ScentDNARadarChart scentDNA={currentMolecule.scentDNA} />
                         </div>
                    </div>
                </div>
            </div>
            <button onClick={nextCard} className="mt-6 bg-[#a89984] text-black font-semibold py-2 px-6 rounded-md">Next</button>
        </div>
    );
    
    // Quiz Mode would be more complex and is stubbed out for brevity
    const QuizMode = () => (
        <div className="text-center">
            <h3 className="text-xl">Quiz Mode</h3>
            <p className="text-gray-500">Coming soon!</p>
        </div>
    );


    return (
        <BaseModal title="Olfactory Training Gym" onClose={onClose} size="lg">
            <div className="flex justify-center mb-6 border-b border-gray-800">
                <button onClick={() => setMode('flashcard')} className={`px-4 py-2 font-semibold ${mode === 'flashcard' ? 'text-[#a89984] border-b-2 border-[#a89984]' : 'text-gray-500'}`}>Flashcard Mode</button>
                <button onClick={() => setMode('quiz')} className={`px-4 py-2 font-semibold ${mode === 'quiz' ? 'text-[#a89984] border-b-2 border-[#a89984]' : 'text-gray-500'}`}>Quiz Mode</button>
            </div>
            {mode === 'flashcard' ? <FlashcardMode /> : <QuizMode />}
        </BaseModal>
    );
};

export default TrainingGymModal;
