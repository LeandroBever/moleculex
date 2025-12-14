
import React from 'react';
import { Formula, Molecule, OlfactiveFamily } from '../types';
import { ViewType } from '../App';
import { CATEGORY_HEX_COLORS } from '../constants';

const MiniFormulaCard: React.FC<{ formula: Formula, molecules: Molecule[], onClick: () => void }> = ({ formula, molecules, onClick }) => {
    const topFamilies = React.useMemo(() => {
        const familyDistribution: Record<string, number> = {};
        const totalPercentage = formula.ingredients.reduce((sum, ing) => sum + ing.amount, 0) || 1;
        
        formula.ingredients.forEach(ing => {
            const molecule = molecules.find(m => m.id === ing.moleculeId);
            if (!molecule) return;

            const weight = ing.amount / totalPercentage;
            familyDistribution[molecule.olfactiveFamily] = (familyDistribution[molecule.olfactiveFamily] || 0) + weight;
        });

        const sortedFamilies = Object.entries(familyDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([family]) => family as OlfactiveFamily);
        
        return sortedFamilies.slice(0, 4); // Get top 4 most dominant families
    }, [formula, molecules]);

    return (
        <div 
            onClick={onClick}
            className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
        >
            <div>
                <p className="font-bold text-gray-900 dark:text-white">{formula.name}</p>
                <p className="text-xs text-gray-500">{formula.productType || 'Generic'} &bull; {formula.ingredients.length} ingredients</p>
            </div>
            <div className="flex items-center -space-x-2">
                {topFamilies.map(family => (
                    <div key={family} className="group relative" title={family}>
                        <span
                            className="block h-4 w-4 rounded-full border-2 border-white dark:border-[#1C1C1C]"
                            style={{ backgroundColor: CATEGORY_HEX_COLORS[family] }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

interface FormulaOverviewPanelProps {
    formulas: Formula[];
    molecules: Molecule[];
    onSetView: (view: ViewType) => void;
    onSelectFormula: (formulaId: string) => void;
}

const FormulaOverviewPanel: React.FC<FormulaOverviewPanelProps> = ({ formulas, molecules, onSetView, onSelectFormula }) => {
    // Show most recent formulas - Increased to 6 to fill space
    const recentFormulas = formulas.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
    
    return (
        <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-full flex flex-col shadow-sm dark:shadow-none">
            <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex-shrink-0">
                 <h3 className="text-sm font-semibold text-[#a89984]">Recent Formulas</h3>
            </div>

            {formulas.length > 0 ? (
                <div className="flex-grow space-y-3 overflow-hidden">
                    {recentFormulas.map(f => (
                        <MiniFormulaCard key={f.id} formula={f} molecules={molecules} onClick={() => onSelectFormula(f.id)} />
                    ))}
                </div>
            ) : (
                 <div className="flex-grow flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        <p className="mt-2 font-semibold">No Formulas Yet</p>
                        <p className="text-xs">Create a formula in the Formulary to see it here.</p>
                    </div>
                </div>
            )}
             <div className="mt-auto pt-2 flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
                <button 
                    onClick={() => onSetView('formulary')}
                    className="w-full text-center py-2 text-sm font-semibold text-[#a89984] hover:text-opacity-80 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    Go to Formulary
                </button>
            </div>
        </div>
    );
};

export default FormulaOverviewPanel;
