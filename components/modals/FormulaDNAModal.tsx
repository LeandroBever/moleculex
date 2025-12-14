
import React, { useMemo } from 'react';
import { Formula, Molecule, OlfactiveFamily, ScentFacet } from '../../types';
import BaseModal from '../ui/BaseModal';
import VolatilityPyramid from '../charts/VolatilityPyramid';
import ScentDNARadarChart from '../charts/ScentDNARadarChart';
import OlfactoryMindmap from '../shared/OlfactoryMindmap';
import MindmapLegend from '../shared/MindmapLegend';

interface FormulaDNAModalProps {
    formula: Formula;
    molecules: Molecule[];
    onClose: () => void;
}

export interface TierMolecule {
    id: string;
    name: string;
    family: OlfactiveFamily;
    amount: number;
}


const FormulaDNAModal: React.FC<FormulaDNAModalProps> = ({ formula, molecules, onClose }) => {

    const moleculesInFormula = useMemo(() => {
        const moleculeIdsInFormula = new Set(formula.ingredients.map(ing => ing.moleculeId));
        return molecules.filter(m => moleculeIdsInFormula.has(m.id));
    }, [formula, molecules]);

    const familyCounts = useMemo(() => {
        return moleculesInFormula.reduce((acc, molecule) => {
            acc[molecule.olfactiveFamily] = (acc[molecule.olfactiveFamily] || 0) + 1;
            return acc;
        }, {} as Record<OlfactiveFamily, number>);
    }, [moleculesInFormula]);

    const formulaData = useMemo(() => {
        const totalAmount = formula.ingredients.reduce((sum, ing) => sum + ing.amount, 0) || 1;

        const volatility = { top: 0, heart: 0, base: 0 };
        const allFacets: Record<string, number> = {};
        
        const topMolecules: TierMolecule[] = [];
        const topHeartMolecules: TierMolecule[] = [];
        const heartMolecules: TierMolecule[] = [];
        const heartBaseMolecules: TierMolecule[] = [];
        const baseMolecules: TierMolecule[] = [];


        formula.ingredients.forEach((ing, index) => {
            const molecule = molecules.find(m => m.id === ing.moleculeId);
            if (!molecule) return;

            const weight = ing.amount;
            const hasRole = (role: string) => molecule.roles.includes(role);

            // --- Volatility percentage calculation ---
            if (hasRole('Top Note')) volatility.top += weight;
            if (hasRole('Heart Note')) volatility.heart += weight;
            if (hasRole('Base Note')) volatility.base += weight;
            if (hasRole('Top-Heart Note')) {
                volatility.top += weight * 0.5;
                volatility.heart += weight * 0.5;
            }
            if (hasRole('Heart-Base Note')) {
                volatility.heart += weight * 0.5;
                volatility.base += weight * 0.5;
            }
            
            // --- This part is for populating molecule lists for visualization ---
            const moleculeDataForVis: TierMolecule = {
                id: `${molecule.id}-${index}`, // Use index for unique key
                name: molecule.name,
                family: molecule.olfactiveFamily,
                amount: ing.amount,
            };

            if (hasRole('Top Note')) {
                topMolecules.push(moleculeDataForVis);
            } else if (hasRole('Top-Heart Note')) {
                topHeartMolecules.push(moleculeDataForVis);
            } else if (hasRole('Heart Note')) {
                heartMolecules.push(moleculeDataForVis);
            } else if (hasRole('Heart-Base Note')) {
                heartBaseMolecules.push(moleculeDataForVis);
            } else if (hasRole('Base Note')) {
                baseMolecules.push(moleculeDataForVis);
            }
            
            // Scent DNA
            const dnaWeight = ing.amount / totalAmount;
            for (const facet in molecule.scentDNA) {
                allFacets[facet] = (allFacets[facet] || 0) + (molecule.scentDNA[facet as ScentFacet] * dnaWeight);
            }
        });

        const totalVolatility = volatility.top + volatility.heart + volatility.base || 1;
        const finalVolatility = {
            top: (volatility.top / totalVolatility) * 100,
            heart: (volatility.heart / totalVolatility) * 100,
            base: (volatility.base / totalVolatility) * 100,
        };

        const topFacets = Object.entries(allFacets)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6);
            
        const combinedScentDNA = Object.fromEntries(topFacets);

        return { 
            volatility: {
                ...finalVolatility,
                topMolecules,
                topHeartMolecules,
                heartMolecules,
                heartBaseMolecules,
                baseMolecules,
            },
            combinedScentDNA 
        };

    }, [formula, molecules]);

    return (
        <BaseModal title={`Formula DNA: ${formula.name}`} onClose={onClose} size="full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                
                {/* 1. Volatility Pyramid */}
                <div className="bg-[#111] border border-gray-800 rounded-lg p-4 flex flex-col h-[400px]">
                    <h3 className="text-center font-bold text-[#a89984] mb-2">Volatility Pyramid</h3>
                    <div className="flex-grow">
                      <VolatilityPyramid volatilityData={formulaData.volatility} />
                    </div>
                </div>

                {/* 2. Scent DNA Radar */}
                <div className="bg-[#111] border border-gray-800 rounded-lg p-4 flex flex-col h-[400px]">
                    <h3 className="text-center font-bold text-[#a89984] mb-2">Combined Scent DNA (Top 6 Facets)</h3>
                    <div className="flex-grow">
                      <ScentDNARadarChart scentDNA={formulaData.combinedScentDNA} />
                    </div>
                </div>

                {/* 3. Olfactive Family Mindmap */}
                <div className="bg-[#111] border border-gray-800 rounded-lg p-4 flex flex-col h-[400px]">
                    <h3 className="text-center font-bold text-[#a89984] mb-2">Olfactive Family Distribution</h3>
                    <div className="flex-grow relative">
                      <OlfactoryMindmap molecules={moleculesInFormula} />
                    </div>
                    <div className="flex-shrink-0 pt-3">
                        <MindmapLegend familyCounts={familyCounts} />
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default FormulaDNAModal;
