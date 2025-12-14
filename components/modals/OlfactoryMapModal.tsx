
import React from 'react';
import { Molecule, OlfactiveFamily } from '../../types';
import BaseModal from '../ui/BaseModal';
import FamilyDistributionPolarAreaChart from '../charts/FamilyDistributionPolarAreaChart';

interface OlfactoryMapModalProps {
    molecules: Molecule[];
    onClose: () => void;
}

const OlfactoryMapModal: React.FC<OlfactoryMapModalProps> = ({ molecules, onClose }) => {
    const familyCounts = molecules.reduce((acc, molecule) => {
        acc[molecule.olfactiveFamily] = (acc[molecule.olfactiveFamily] || 0) + 1;
        return acc;
    }, {} as Record<OlfactiveFamily, number>);

    return (
        <BaseModal title="Olfactory Map (My Library)" onClose={onClose} size="lg">
            <div className="text-center text-gray-400 mb-4">
                This chart shows the distribution of materials in your library, helping you find gaps in your palette.
            </div>
            <div className="h-[500px] w-full mx-auto">
                <FamilyDistributionPolarAreaChart familyData={familyCounts} />
            </div>
        </BaseModal>
    );
};

export default OlfactoryMapModal;
