

import React, { useState, useMemo, useEffect } from 'react';
import { Formula, Molecule, FormulaIngredient } from '../../types';
import BaseModal from '../ui/BaseModal';

interface FormularyModalProps {
    formulas: Formula[];
    molecules: Molecule[];
    onSave: (formula: Formula) => void;
    onClose: () => void;
    onOpenFormulaDNA: (formula: Formula) => void;
    moleculeToAdd: Molecule | null;
    onMoleculeAdded: () => void;
}

const FormularyModal: React.FC<FormularyModalProps> = ({ formulas, molecules, onSave, onClose, onOpenFormulaDNA, moleculeToAdd, onMoleculeAdded }) => {
    const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(formulas[0]?.id || null);
    const [editedFormula, setEditedFormula] = useState<Formula | null>(null);

    useEffect(() => {
        if (selectedFormulaId) {
            setEditedFormula(formulas.find(f => f.id === selectedFormulaId) || null);
        } else {
            setEditedFormula(null);
        }
    }, [selectedFormulaId, formulas]);

    useEffect(() => {
        if (moleculeToAdd && editedFormula && !editedFormula.ingredients.some(ing => ing.moleculeId === moleculeToAdd.id)) {
            const newIngredient: FormulaIngredient = {
                moleculeId: moleculeToAdd.id,
                myDilution: 100,
                // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
                amount: 0,
            };
            setEditedFormula(f => f ? { ...f, ingredients: [...f.ingredients, newIngredient] } : null);
            onMoleculeAdded();
        }
    }, [moleculeToAdd, editedFormula, onMoleculeAdded]);

    const handleIngredientChange = (index: number, field: keyof FormulaIngredient, value: string | number) => {
        if (!editedFormula) return;
        
        const newIngredients = [...editedFormula.ingredients];
        const newIngredient = { ...newIngredients[index] };

        // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
        if (field === 'myDilution' || field === 'amount') {
            newIngredient[field] = parseFloat(value as string) || 0;
        } else {
            newIngredient.moleculeId = value as string;
        }
        
        newIngredients[index] = newIngredient;
        setEditedFormula({ ...editedFormula, ingredients: newIngredients });
    };


    const handleAddIngredient = () => {
        if (!editedFormula || molecules.length === 0) return;
        // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
        const newIngredient: FormulaIngredient = { moleculeId: molecules[0].id, myDilution: 100, amount: 0 };
        setEditedFormula({ ...editedFormula, ingredients: [...editedFormula.ingredients, newIngredient] });
    };
    
    const handleRemoveIngredient = (index: number) => {
        if (!editedFormula) return;
        const newIngredients = editedFormula.ingredients.filter((_, i) => i !== index);
        setEditedFormula({ ...editedFormula, ingredients: newIngredients });
    };

    const handleCreateNewFormula = () => {
      // FIX: Add missing 'unit' property to satisfy the Formula type.
      const newFormula: Formula = {
        id: `formula-${Date.now()}`,
        name: 'New Formula',
        unit: 'weight',
        finalDilution: 20,
        ingredients: [],
        createdAt: new Date().toISOString(),
      };
      onSave(newFormula);
      setSelectedFormulaId(newFormula.id);
    }
    
    const complianceData = useMemo(() => {
        if (!editedFormula) return { complianceMap: new Map(), nonCompliantCount: 0 };

        const complianceMap = new Map<string, { status: 'PASS' | 'FAIL' | 'N/A'; activeInFinal: number }>();
        let nonCompliantCount = 0;
        
        editedFormula.ingredients.forEach(ing => {
            const molecule = molecules.find(m => m.id === ing.moleculeId);
            if (!molecule || molecule.IFRA_MAX_CONCENTRATION === undefined) {
                complianceMap.set(ing.moleculeId, { status: 'N/A', activeInFinal: 0 });
                return;
            }
            
            // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
            const activeInConc = (ing.amount / 100) * (ing.myDilution / 100);
            const activeInFinal = activeInConc * (editedFormula.finalDilution / 100) * 100; // as a percentage
            
            const isCompliant = activeInFinal <= molecule.IFRA_MAX_CONCENTRATION;
            if (!isCompliant) nonCompliantCount++;

            complianceMap.set(ing.moleculeId, { status: isCompliant ? 'PASS' : 'FAIL', activeInFinal });
        });
        
        return { complianceMap, nonCompliantCount };
    }, [editedFormula, molecules]);

    const totals = useMemo(() => {
      if (!editedFormula) return { conc: 0, active: 0, cost: 0 };
      let totalConc = 0;
      let totalActive = 0;
      let totalCost = 0;
      
      editedFormula.ingredients.forEach(ing => {
        const molecule = molecules.find(m => m.id === ing.moleculeId);
        // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
        totalConc += ing.amount;
        // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
        const activeInConc = (ing.amount / 100) * (ing.myDilution / 100);
        totalActive += activeInConc * 100;
        if(molecule?.avgCostPerGram) {
          // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
          totalCost += ing.amount * (molecule.avgCostPerGram);
        }
      });
      return { conc: totalConc, active: totalActive, cost: totalCost / 100 }; // Cost for 1g of concentrate
    }, [editedFormula, molecules]);


    return (
        <BaseModal title="Formulary" onClose={onClose} size="full">
            <div className="flex flex-col h-full">
                {/* Toolbar */}
                <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-800">
                    <select
                        value={selectedFormulaId || ''}
                        onChange={(e) => setSelectedFormulaId(e.target.value)}
                        className="bg-[#111111] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#a89984] w-64"
                    >
                        {formulas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <button onClick={handleCreateNewFormula} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">New Formula</button>
                    {editedFormula && <button onClick={() => onSave(editedFormula)} className="bg-[#a89984] hover:bg-opacity-80 text-black font-semibold py-2 px-4 rounded-md transition-colors text-sm">Save Changes</button>}
                    {editedFormula && <button onClick={() => onOpenFormulaDNA(editedFormula)} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">Formula DNA</button>}
                </div>

                {editedFormula ? (
                    <div className="flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <input type="text" value={editedFormula.name} onChange={e => setEditedFormula({...editedFormula, name: e.target.value})} className="bg-[#111] border border-gray-700 rounded p-2" placeholder="Formula Name" />
                          <div>
                            <label className="text-xs text-gray-400">Final Dilution (%)</label>
                            <input type="number" value={editedFormula.finalDilution} onChange={e => setEditedFormula({...editedFormula, finalDilution: parseFloat(e.target.value) || 0})} className="w-full bg-[#111] border border-gray-700 rounded p-2" />
                          </div>
                        </div>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-[#111111]">
                                    <tr>
                                        <th className="px-4 py-3">Material</th>
                                        <th className="px-4 py-3">My Dil. %</th>
                                        <th className="px-4 py-3">% in Conc.</th>
                                        <th className="px-4 py-3">% Active</th>
                                        <th className="px-4 py-3">Cost</th>
                                        <th className="px-4 py-3">IFRA Status</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editedFormula.ingredients.map((ing, index) => {
                                        const molecule = molecules.find(m => m.id === ing.moleculeId);
                                        const comp = complianceData.complianceMap.get(ing.moleculeId);
                                        // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
                                        const activeInConc = (ing.amount / 100) * (ing.myDilution / 100);
                                        // FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type.
                                        const cost = molecule?.avgCostPerGram ? (ing.amount / 100) * molecule.avgCostPerGram : 0;
                                        const isFail = comp?.status === 'FAIL';
                                        return (
                                            <tr key={index} className={`border-b border-gray-800 ${isFail ? 'bg-red-900/50' : ''}`}>
                                                <td className="px-4 py-2">
                                                    <select value={ing.moleculeId} onChange={e => handleIngredientChange(index, 'moleculeId', e.target.value)} className="bg-transparent border-0 focus:ring-0 w-full p-0">
                                                        {molecules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2"><input type="number" value={ing.myDilution} onChange={e => handleIngredientChange(index, 'myDilution', e.target.value)} className="w-20 bg-transparent border-0 focus:ring-0 p-0" /></td>
                                                {/* FIX: Use 'amount' instead of 'percentageInConcentrate' to match FormulaIngredient type. */}
                                                <td className="px-4 py-2"><input type="number" value={ing.amount} onChange={e => handleIngredientChange(index, 'amount', e.target.value)} className="w-20 bg-transparent border-0 focus:ring-0 p-0" /></td>
                                                <td className="px-4 py-2 font-mono">{(activeInConc * 100).toFixed(2)}</td>
                                                <td className="px-4 py-2 font-mono">${cost.toFixed(3)}</td>
                                                <td className={`px-4 py-2 font-bold ${isFail ? 'text-red-400' : 'text-green-400'}`}>{comp?.status}</td>
                                                <td className="px-4 py-2"><button onClick={() => handleRemoveIngredient(index)} className="text-red-500 hover:text-red-400 p-1">&times;</button></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={handleAddIngredient} className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">Add Ingredient</button>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-start">
                            <div className="text-sm">
                                <h4 className="font-bold mb-2">Compliance Summary</h4>
                                <div className={`flex items-center space-x-2 ${complianceData.nonCompliantCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    <span>Overall Status: {complianceData.nonCompliantCount > 0 ? 'FAIL' : 'PASS'}</span>
                                    {complianceData.nonCompliantCount > 0 && <span>({complianceData.nonCompliantCount} material{complianceData.nonCompliantCount > 1 ? 's' : ''} non-compliant)</span>}
                                </div>
                            </div>
                            <div className="text-right font-mono text-sm">
                                <div className="grid grid-cols-2 gap-x-4">
                                    <span className="text-gray-400">Total Concentrate %:</span> <span className="text-white">{totals.conc.toFixed(2)}%</span>
                                    <span className="text-gray-400">Total Active %:</span> <span className="text-white">{totals.active.toFixed(2)}%</span>
                                    <span className="text-gray-400">Total Cost / g:</span> <span className="text-white">${totals.cost.toFixed(3)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a formula or create a new one to begin.</p>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default FormularyModal;