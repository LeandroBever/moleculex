
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Formula, Molecule, FormulaIngredient, ProductType, OlfactiveFamily, OlfactiveFamilyProfile, FormulaEvaluation } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';
import MaterialSelector from '../shared/MaterialSelector';
import VolatilityPyramid from '../charts/VolatilityPyramid';
import ScentDNARadarChart from '../charts/ScentDNARadarChart';
import OlfactoryMindmap from '../shared/OlfactoryMindmap';
import MindmapLegend from '../shared/MindmapLegend';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

interface FormularyViewProps {
    formulas: Formula[];
    molecules: Molecule[];
    olfactiveFamilyProfiles: Record<OlfactiveFamily, OlfactiveFamilyProfile>;
    onSave: (formula: Formula) => void;
    onDelete: (formula: Formula) => void;
    onOpenFormulaDNA: (formula: Formula) => void;
    moleculeToAdd: Molecule | null;
    onMoleculeAdded: () => void;
    initialFormulaId: string | null;
    currencySymbol: string;
}

interface TierMolecule {
    id: string;
    name: string;
    family: OlfactiveFamily;
    amount: number;
}

const InfoCard: React.FC<{title: string; children: React.ReactNode; className?: string}> = React.memo(({ title, children, className = "" }) => (
    <div className={`bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-sm dark:shadow-none ${className}`}>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
        {children}
    </div>
));

const FormularyView: React.FC<FormularyViewProps> = ({ formulas, molecules, olfactiveFamilyProfiles, onSave, onDelete, onOpenFormulaDNA, moleculeToAdd, onMoleculeAdded, initialFormulaId, currencySymbol }) => {
    const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(initialFormulaId || null);
    const [editedFormula, setEditedFormula] = useState<Formula | null>(null);
    const [finishedPerfumeWeight, setFinishedPerfumeWeight] = useState(100);
    const [tooltip, setTooltip] = useState<{ content: React.ReactNode; x: number; y: number; } | null>(null);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [showIncomingIngredientModal, setShowIncomingIngredientModal] = useState(false);
    const [importTarget, setImportTarget] = useState<'new' | 'selected'>('new');
    const [importSelectedId, setImportSelectedId] = useState<string>('');
    const [ingredientToDeleteIndex, setIngredientToDeleteIndex] = useState<number | null>(null);
    
    const [newEvalStatus, setNewEvalStatus] = useState<'Fresh' | '1 Day' | '1 Week' | '2 Weeks' | '1 Month+'>('Fresh');
    const [newEvalScore, setNewEvalScore] = useState<number>(5);
    const [newEvalNotes, setNewEvalNotes] = useState<string>('');

    useEffect(() => {
        if (selectedFormulaId) {
            const found = formulas.find(f => f.id === selectedFormulaId);
            if (found) {
                setEditedFormula(JSON.parse(JSON.stringify(found)));
                setImportSelectedId(selectedFormulaId);
            } else {
                setSelectedFormulaId(null);
                setEditedFormula(null);
            }
        } else {
            setEditedFormula(null);
            if (formulas.length > 0) setImportSelectedId(formulas[0].id);
        }
    }, [selectedFormulaId, formulas]);

    useEffect(() => {
        if (moleculeToAdd) {
            setShowIncomingIngredientModal(true);
            if (selectedFormulaId) {
                setImportTarget('selected');
                setImportSelectedId(selectedFormulaId);
            } else {
                setImportTarget('new');
            }
        }
    }, [moleculeToAdd]);

    const handleConfirmImport = useCallback(() => {
        if (!moleculeToAdd) return;
        if (importTarget === 'new') {
            const newFormula: Formula = {
                id: `formula-${Date.now()}`,
                name: `Formula with ${moleculeToAdd.name}`,
                unit: 'weight',
                finalDilution: 20,
                productType: ProductType.FINE_FRAGRANCE,
                customProductType: '',
                ingredients: [{ moleculeId: moleculeToAdd.id, myDilution: 100, amount: 0 }],
                createdAt: new Date().toISOString(),
                mood: 'default',
                notes: '',
                evaluations: []
            };
            onSave(newFormula);
            setSelectedFormulaId(newFormula.id);
        } else if (importTarget === 'selected' && importSelectedId) {
            const formulaToUpdate = formulas.find(f => f.id === importSelectedId);
            if (formulaToUpdate) {
                const alreadyExists = formulaToUpdate.ingredients.some(ing => ing.moleculeId === moleculeToAdd.id);
                if (!alreadyExists) {
                    const updatedFormula = {
                        ...formulaToUpdate,
                        ingredients: [...formulaToUpdate.ingredients, { moleculeId: moleculeToAdd.id, myDilution: 100, amount: 0 }]
                    };
                    onSave(updatedFormula);
                    setSelectedFormulaId(importSelectedId);
                } else {
                    setSelectedFormulaId(importSelectedId);
                }
            }
        }
        setShowIncomingIngredientModal(false);
        onMoleculeAdded();
    }, [moleculeToAdd, importTarget, importSelectedId, formulas, onSave, onMoleculeAdded]);

    const handleCancelImport = useCallback(() => {
        setShowIncomingIngredientModal(false);
        onMoleculeAdded();
    }, [onMoleculeAdded]);

    const handleFieldChange = useCallback((field: keyof Formula, value: any) => {
        setEditedFormula(prev => {
            if (!prev) return null;
            let newValue = value;
            if (field === 'finalDilution') newValue = Math.min(100, Math.max(0, parseFloat(value) || 0));
            const newFormula = { ...prev, [field]: newValue };
            if (field === 'productType' && value !== ProductType.OTHER) newFormula.customProductType = '';
            return newFormula;
        });
    }, []);

    const handleIngredientChange = useCallback((index: number, field: keyof FormulaIngredient, value: string | number) => {
        setEditedFormula(prev => {
            if (!prev) return null;
            const newIngredients = [...prev.ingredients];
            const newIngredient = { ...newIngredients[index] };
            if (field === 'myDilution') newIngredient[field] = Math.min(100, Math.max(0, parseFloat(value as string) || 0));
            else if (field === 'amount') newIngredient[field] = parseFloat(value as string) || 0;
            else if (field === 'solventId') newIngredient[field] = value as string;
            else newIngredient.moleculeId = value as string;
            newIngredients[index] = newIngredient;
            return { ...prev, ingredients: newIngredients };
        });
    }, []);

    const handleIngredientWeightChange = useCallback((index: number, value: string) => {
        if (!editedFormula) return;
        const totalConcentrateWeight = (editedFormula.finalDilution / 100) * finishedPerfumeWeight;
        if (totalConcentrateWeight <= 0) return;
        const weight = parseFloat(value);
        const newPercentage = isNaN(weight) ? 0 : (weight / totalConcentrateWeight) * 100;
        
        setEditedFormula(prev => {
            if (!prev) return null;
            const newIngredients = [...prev.ingredients];
            newIngredients[index] = { ...newIngredients[index], amount: newPercentage };
            return { ...prev, ingredients: newIngredients };
        });
    }, [editedFormula, finishedPerfumeWeight]);

    const handleAddIngredient = useCallback(() => {
        if (!editedFormula || molecules.length === 0) return;
        const newIngredient: FormulaIngredient = { moleculeId: '', myDilution: 100, amount: 0 };
        setEditedFormula(prev => prev ? { ...prev, ingredients: [...prev.ingredients, newIngredient] } : null);
    }, [editedFormula, molecules.length]);

    const handleRequestDeleteIngredient = useCallback((index: number) => {
        setIngredientToDeleteIndex(index);
    }, []);

    const handleConfirmDeleteIngredient = useCallback(() => {
        if (!editedFormula || ingredientToDeleteIndex === null) return;
        const newIngredients = editedFormula.ingredients.filter((_, i) => i !== ingredientToDeleteIndex);
        setEditedFormula({ ...editedFormula, ingredients: newIngredients });
        setIngredientToDeleteIndex(null);
    }, [editedFormula, ingredientToDeleteIndex]);

    const handleCreateNewFormula = useCallback(() => {
        const newFormula: Formula = {
            id: `formula-${Date.now()}`, name: 'New Formula', unit: 'weight', finalDilution: 20,
            productType: ProductType.FINE_FRAGRANCE, customProductType: '', ingredients: [],
            createdAt: new Date().toISOString(), mood: 'default', notes: '', evaluations: []
        };
        onSave(newFormula);
        setSelectedFormulaId(newFormula.id);
    }, [onSave]);

    const handleSaveFormula = useCallback(() => {
        if (editedFormula) {
            onSave(editedFormula);
            setShowSaveConfirmation(true);
            setTimeout(() => setShowSaveConfirmation(false), 3000);
        }
    }, [editedFormula, onSave]);

    const handleAddEvaluation = useCallback(() => {
        if (!editedFormula || !newEvalNotes.trim()) return;
        const newEval: FormulaEvaluation = { id: `eval-${Date.now()}`, date: new Date().toISOString().split('T')[0], status: newEvalStatus, score: newEvalScore, notes: newEvalNotes };
        setEditedFormula(prev => prev ? { ...prev, evaluations: [...(prev.evaluations || []), newEval] } : null);
        setNewEvalNotes(''); setNewEvalScore(5); setNewEvalStatus('Fresh');
    }, [editedFormula, newEvalStatus, newEvalScore, newEvalNotes]);

    const handleDeleteEvaluation = useCallback((evalId: string) => {
        setEditedFormula(prev => prev ? { ...prev, evaluations: prev.evaluations?.filter(e => e.id !== evalId) || [] } : null);
    }, []);

    const handleExportPDF = useCallback(async () => {
        if (!editedFormula) return;
        try {
            const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.es.min.js');
            const { default: autoTable } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.es.min.js');

            const doc = new jsPDF();
            doc.setFontSize(22); doc.setTextColor(40, 40, 40); doc.text(editedFormula.name, 14, 20);
            doc.setFontSize(10); doc.setTextColor(100, 100, 100);
            doc.text(`Created: ${new Date(editedFormula.createdAt).toLocaleDateString()}`, 14, 28);
            doc.text(`Target Product: ${editedFormula.productType || 'Fine Fragrance'}`, 14, 33);
            doc.text(`Final Dilution: ${editedFormula.finalDilution}%`, 14, 38);

            const totalAmount = editedFormula.ingredients.reduce((acc, ing) => acc + ing.amount, 0);
            const tableBody = editedFormula.ingredients.map((ing) => {
                const molecule = molecules.find(m => m.id === ing.moleculeId);
                const percent = totalAmount > 0 ? ((ing.amount / totalAmount) * 100).toFixed(2) + '%' : '0%';
                return [molecule?.name || 'Unknown', molecule?.olfactiveFamily || '-', molecule?.casNumber || '-', ing.amount.toFixed(2), percent];
            });
            
            autoTable(doc, { startY: 45, head: [['Ingredient', 'Family', 'CAS #', `Quantity (${editedFormula.unit})`, 'Percentage']], body: tableBody, theme: 'grid', styles: { fontSize: 9, cellPadding: 3 }, headStyles: { fillColor: [168, 153, 132], textColor: [255, 255, 255] }, alternateRowStyles: { fillColor: [245, 245, 245] } });
            
            const finalY = (doc as any).lastAutoTable.finalY || 100;
            if (editedFormula.notes) {
                doc.setFontSize(12); doc.setTextColor(40, 40, 40); doc.text("Notes:", 14, finalY + 10);
                doc.setFontSize(10); doc.setTextColor(80, 80, 80); doc.text(doc.splitTextToSize(editedFormula.notes, 180), 14, finalY + 16);
            }
            doc.setFontSize(8); doc.setTextColor(150, 150, 150); doc.text("Generated by MoleculeX", 14, 285);
            doc.save(`${editedFormula.name.replace(/\s+/g, '_')}_Recipe.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
            alert("Could not load PDF generator. Please check internet connection.");
        }
    }, [editedFormula, molecules]);

    const formulaAnalysis = useMemo(() => {
        if (!editedFormula) return { complianceMap: new Map(), nonCompliantCount: 0, totals: { concentrateWeight: 0, rawMaterialCost: 0, totalDrops: 0 }, dominantFamily: null, hiddenSolvents: {} };
        const complianceMap = new Map(); let nonCompliantCount = 0;
        let totals = { concentrateWeight: 0, rawMaterialCost: 0, totalDrops: 0 };
        const familyWeights: Record<string, number> = {}; const hiddenSolvents: Record<string, number> = {};
        if (editedFormula.unit === 'weight') {
            const totalConcentrateWeight = (editedFormula.finalDilution / 100) * finishedPerfumeWeight;
            totals.concentrateWeight = totalConcentrateWeight;
            editedFormula.ingredients.forEach(ing => {
                const molecule = molecules.find(m => m.id === ing.moleculeId);
                const weightOfIngredientAdded = (ing.amount / 100) * totalConcentrateWeight;
                const weightOfRawMaterial = weightOfIngredientAdded * (ing.myDilution / 100);
                const weightOfSolvent = weightOfIngredientAdded - weightOfRawMaterial;
                if (molecule?.avgCostPerGram) totals.rawMaterialCost += weightOfRawMaterial * molecule.avgCostPerGram;
                if (ing.myDilution < 100 && ing.solventId && weightOfSolvent > 0) {
                    const solvent = molecules.find(m => m.id === ing.solventId);
                    hiddenSolvents[solvent ? solvent.name : 'Unknown Solvent'] = (hiddenSolvents[solvent ? solvent.name : 'Unknown Solvent'] || 0) + weightOfSolvent;
                }
                if (!molecule || molecule.IFRA_MAX_CONCENTRATION === undefined) complianceMap.set(ing.moleculeId, { status: 'N/A' });
                else {
                    const isCompliant = (weightOfRawMaterial / finishedPerfumeWeight) * 100 <= molecule.IFRA_MAX_CONCENTRATION;
                    if (!isCompliant) nonCompliantCount++;
                    complianceMap.set(ing.moleculeId, { status: isCompliant ? 'PASS' : 'FAIL' });
                }
                if (molecule) familyWeights[molecule.olfactiveFamily] = (familyWeights[molecule.olfactiveFamily] || 0) + ing.amount;
            });
        } else {
             editedFormula.ingredients.forEach(ing => {
                 const molecule = molecules.find(m => m.id === ing.moleculeId);
                 complianceMap.set(ing.moleculeId, { status: 'N/A' });
                 totals.totalDrops += ing.amount;
                 if (molecule) familyWeights[molecule.olfactiveFamily] = (familyWeights[molecule.olfactiveFamily] || 0) + ing.amount;
            });
        }
        let dominantFamily = Object.keys(familyWeights).length > 0 ? Object.keys(familyWeights).reduce((a, b) => familyWeights[a] > familyWeights[b] ? a : b) as OlfactiveFamily : null;
        return { complianceMap, nonCompliantCount, totals, dominantFamily, hiddenSolvents };
    }, [editedFormula, molecules, finishedPerfumeWeight]);

    const moleculesInFormula = useMemo(() => {
        if (!editedFormula) return [];
        const moleculeIds = new Set(editedFormula.ingredients.map(ing => ing.moleculeId));
        return molecules.filter(m => moleculeIds.has(m.id));
    }, [editedFormula, molecules]);
    
    const solventOptions = useMemo(() => molecules.filter(m => m.olfactiveFamily === OlfactiveFamily.SOLVENT), [molecules]);
    const familyCounts = useMemo(() => moleculesInFormula.reduce((acc, m) => { acc[m.olfactiveFamily] = (acc[m.olfactiveFamily] || 0) + 1; return acc; }, {} as Record<OlfactiveFamily, number>), [moleculesInFormula]);

    const formulaDNAData = useMemo(() => {
        if (!editedFormula) return null;
        const rawTotalAmount = editedFormula.ingredients.reduce((sum, ing) => sum + ing.amount, 0);
        const effectiveTotalAmount = rawTotalAmount === 0 ? (editedFormula.ingredients.length || 1) : rawTotalAmount;
        const volatility = { top: 0, heart: 0, base: 0 }; const allFacets: Record<string, number> = {};
        const topMolecules: TierMolecule[] = [], topHeartMolecules: TierMolecule[] = [], heartMolecules: TierMolecule[] = [], heartBaseMolecules: TierMolecule[] = [], baseMolecules: TierMolecule[] = [];

        editedFormula.ingredients.forEach((ing, index) => {
            const molecule = molecules.find(m => m.id === ing.moleculeId);
            if (!molecule) return;
            const weight = rawTotalAmount === 0 ? 1 : ing.amount;
            const hasRole = (role: string) => molecule.roles.includes(role);
            if (hasRole('Top Note')) volatility.top += weight; if (hasRole('Heart Note')) volatility.heart += weight; if (hasRole('Base Note')) volatility.base += weight;
            if (hasRole('Top-Heart Note')) { volatility.top += weight * 0.5; volatility.heart += weight * 0.5; }
            if (hasRole('Heart-Base Note')) { volatility.heart += weight * 0.5; volatility.base += weight * 0.5; }
            
            const mVis: TierMolecule = { id: `${molecule.id}-${index}`, name: molecule.name, family: molecule.olfactiveFamily, amount: ing.amount };
            if (hasRole('Top Note')) topMolecules.push(mVis); else if (hasRole('Top-Heart Note')) topHeartMolecules.push(mVis); else if (hasRole('Heart Note')) heartMolecules.push(mVis); else if (hasRole('Heart-Base Note')) heartBaseMolecules.push(mVis); else if (hasRole('Base Note')) baseMolecules.push(mVis);
            
            const dnaWeight = weight / effectiveTotalAmount;
            for (const facet in molecule.scentDNA) { allFacets[facet] = (allFacets[facet] || 0) + (molecule.scentDNA[facet] * dnaWeight); }
        });
        const totalVol = volatility.top + volatility.heart + volatility.base || 1;
        const finalVol = { top: (volatility.top / totalVol) * 100, heart: (volatility.heart / totalVol) * 100, base: (volatility.base / totalVol) * 100 };
        const combinedScentDNA = Object.fromEntries(Object.entries(allFacets).sort(([, a], [, b]) => b - a).slice(0, 6));
        return { volatility: { ...finalVol, topMolecules, topHeartMolecules, heartMolecules, heartBaseMolecules, baseMolecules }, combinedScentDNA };
    }, [editedFormula, molecules]);

    const handleMouseEnter = useCallback((event: React.MouseEvent, moleculeId: string) => {
        const molecule = molecules.find(m => m.id === moleculeId);
        if (!molecule) return;
        const familyProfile = olfactiveFamilyProfiles[molecule.olfactiveFamily];
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({ content: (<div className="text-xs text-left w-64"><p className="font-bold text-white text-sm mb-1">{molecule.name}</p><p className="font-semibold" style={{ color: CATEGORY_HEX_COLORS[molecule.olfactiveFamily] }}>{molecule.olfactiveFamily}</p><p className="text-gray-400 mb-2">IFRA Max: {molecule.IFRA_MAX_CONCENTRATION}%</p>{familyProfile && (<div className="pt-2 border-t border-gray-700"><p className="font-bold text-gray-300">{familyProfile.mainCharacter}</p><p className="text-gray-500 leading-snug">{familyProfile.description}</p></div>)}</div>), x: rect.left + rect.width / 2, y: rect.top });
    }, [molecules, olfactiveFamilyProfiles]);

    const handleMouseLeave = useCallback(() => setTooltip(null), []);
    
    if (!selectedFormulaId && !showIncomingIngredientModal) {
        return (
             <div className="animate-fade-in pt-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Formulas</h1><p className="text-gray-500 dark:text-gray-400 mt-1">Select a formula to view or create a new one.</p></div>
                    <button onClick={handleCreateNewFormula} className="mt-4 md:mt-0 border border-[#a89984] text-[#a89984] hover:bg-[#a89984]/10 font-semibold py-2 px-4 rounded-md transition-colors text-sm outline-none">Create New Formula</button>
                </div>
                 {formulas.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {formulas.map(formula => {
                            const mood = (formula.mood && formula.mood !== 'default') ? formula.mood : OlfactiveFamily.AROMATIC;
                            const color = CATEGORY_HEX_COLORS[mood];
                            return (<button key={formula.id} onClick={() => setSelectedFormulaId(formula.id)} className="p-4 rounded-lg border text-left transition-all transform hover:scale-105" style={{ backgroundColor: `${color}20`, borderColor: color }}><h2 className="font-bold text-lg text-gray-900 dark:text-white truncate">{formula.name}</h2><p className="text-sm" style={{ color }}>{formula.ingredients.length} materials</p></button>);
                        })}
                    </div>
                 ) : (<div className="flex-grow flex items-center justify-center text-center text-gray-500 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg h-96"><div><svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg><p className="mt-4 font-semibold">No Formulas Yet</p><p className="text-xs text-gray-500 dark:text-gray-400">Click 'Create New Formula' to get started.</p></div></div>)}
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in pt-12 flex flex-col relative pb-24">
            {tooltip && (<div className="fixed z-50 bg-black border border-gray-700 rounded-md shadow-lg p-3 transform -translate-x-1/2 -translate-y-full" style={{ left: tooltip.x, top: tooltip.y }}>{tooltip.content}</div>)}
            {ingredientToDeleteIndex !== null && (<ConfirmDeleteModal itemName="this ingredient" itemType="Ingredient" onConfirm={handleConfirmDeleteIngredient} onCancel={() => setIngredientToDeleteIndex(null)} />)}
            {showSaveConfirmation && (<div className="fixed bottom-6 right-6 z-50 bg-[#a89984] text-black px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span className="font-bold">Formula Saved</span></div>)}
            {showIncomingIngredientModal && moleculeToAdd && (<div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"><div className="bg-[#1C1C1C] border border-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md animate-fade-in"><div className="flex items-center space-x-3 mb-4"><div className="p-2 bg-[#a89984] rounded-full text-black"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div><div><h3 className="text-lg font-bold text-white">Import Material</h3><p className="text-sm text-gray-400">Adding <strong className="text-[#a89984]">{moleculeToAdd.name}</strong></p></div></div><div className="space-y-4 mb-6"><label className="flex items-center space-x-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-800 transition-colors"><input type="radio" name="importTarget" value="new" checked={importTarget === 'new'} onChange={() => setImportTarget('new')} className="text-[#a89984] focus:ring-[#a89984]" /><span className="text-gray-300">Create New Formula</span></label><div className={`p-3 border border-gray-700 rounded-md ${formulas.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} transition-colors`}><label className="flex items-center space-x-3 cursor-pointer"><input type="radio" name="importTarget" value="selected" checked={importTarget === 'selected'} onChange={() => setImportTarget('selected')} disabled={formulas.length === 0} className="text-[#a89984] focus:ring-[#a89984]" /><span className="text-gray-300">Add to Existing Formula</span></label>{importTarget === 'selected' && (<select value={importSelectedId} onChange={(e) => setImportSelectedId(e.target.value)} className="mt-3 w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm text-white">{formulas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>)}</div></div><div className="flex justify-end space-x-3"><button onClick={handleCancelImport} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button><button onClick={handleConfirmImport} className="px-4 py-2 bg-[#a89984] text-black font-bold rounded-md hover:bg-opacity-90 transition-colors">Import</button></div></div></div>)}
            <div className="flex-shrink-0 flex flex-col md:flex-row md:items-center md:justify-between mb-6"><div className="flex items-center space-x-2"><button onClick={() => setSelectedFormulaId(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><div className="hidden md:flex items-center space-x-2"><span className="text-sm text-gray-500 dark:text-gray-400">Viewing Formula:</span><select value={selectedFormulaId || ''} onChange={(e) => setSelectedFormulaId(e.target.value)} className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#a89984] w-64">{formulas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><h2 className="md:hidden text-xl font-bold text-gray-900 dark:text-white truncate">{editedFormula?.name}</h2></div></div>

            {editedFormula ? (
                <div className="flex flex-col space-y-6">
                     {/* Top Inputs Row */}
                     <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                         <InfoCard title="Unit"><div className="flex items-center space-x-1 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg"><button onClick={() => handleFieldChange('unit', 'weight')} className={`w-full px-2 py-1 rounded-md text-sm font-semibold transition-colors ${editedFormula.unit === 'weight' ? 'bg-[#a89984] text-black' : 'text-gray-500 dark:text-gray-400'}`}>Weight (%)</button><button onClick={() => handleFieldChange('unit', 'drops')} className={`w-full px-2 py-1 rounded-md text-sm font-semibold transition-colors ${editedFormula.unit === 'drops' ? 'bg-[#a89984] text-black' : 'text-gray-500 dark:text-gray-400'}`}>Drops</button></div></InfoCard>
                        <InfoCard title="Product Type"><select value={editedFormula.productType || ProductType.FINE_FRAGRANCE} onChange={e => handleFieldChange('productType', e.target.value)} className="w-full bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#a89984]">{Object.values(ProductType).map(type => (<option key={type} value={type}>{type}</option>))}</select></InfoCard>
                        <InfoCard title="Final Dilution (%)"><input type="number" value={editedFormula.finalDilution} onChange={e => handleFieldChange('finalDilution', e.target.value)} max="100" min="0" className="w-full bg-transparent text-gray-900 dark:text-white font-semibold focus:outline-none" /></InfoCard>
                        <InfoCard title="Finished Weight (g)"><input type="number" value={finishedPerfumeWeight} onChange={e => setFinishedPerfumeWeight(parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-gray-900 dark:text-white font-semibold focus:outline-none" disabled={editedFormula.unit === 'drops'} /></InfoCard>
                         <InfoCard title="Card Color / Mood"><div className="flex items-center space-x-2"><div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0 transition-colors duration-300" style={{ backgroundColor: (editedFormula.mood && editedFormula.mood !== 'default') ? CATEGORY_HEX_COLORS[editedFormula.mood as OlfactiveFamily] : (formulaAnalysis.dominantFamily ? CATEGORY_HEX_COLORS[formulaAnalysis.dominantFamily] : 'transparent') }} /><select value={editedFormula.mood || 'default'} onChange={e => handleFieldChange('mood', e.target.value)} className="w-full bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#a89984]"><option value="default">Auto-detect ({formulaAnalysis.dominantFamily || 'N/A'})</option>{Object.values(OlfactiveFamily).map(family => (<option key={family} value={family}>{family}</option>))}</select></div></InfoCard>
                    </div>
                    
                    {/* Name & Notes Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="md:col-span-1"><InfoCard title="Formula Name" className="h-full"><input type="text" value={editedFormula.name} onChange={e => handleFieldChange('name', e.target.value)} className="w-full bg-transparent text-gray-900 dark:text-white font-semibold focus:outline-none text-lg" /></InfoCard></div><div className="md:col-span-2"><InfoCard title="Notes"><textarea value={editedFormula.notes || ''} onChange={e => handleFieldChange('notes', e.target.value)} rows={2} placeholder="Add personal notes, observations, or modifications..." className="w-full bg-transparent text-gray-600 dark:text-gray-300 focus:outline-none resize-y text-sm" /></InfoCard></div></div>

                    {formulaDNAData && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col h-[350px] shadow-sm dark:shadow-none"><h3 className="text-center font-bold text-[#a89984] mb-2 text-sm uppercase tracking-wider">Volatility Pyramid</h3><div className="flex-grow"><VolatilityPyramid volatilityData={formulaDNAData.volatility} /></div></div>
                            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col h-[350px] shadow-sm dark:shadow-none"><h3 className="text-center font-bold text-[#a89984] mb-2 text-sm uppercase tracking-wider">Scent DNA</h3><div className="flex-grow"><ScentDNARadarChart scentDNA={formulaDNAData.combinedScentDNA} /></div></div>
                            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col h-[350px] shadow-sm dark:shadow-none"><h3 className="text-center font-bold text-[#a89984] mb-2 text-sm uppercase tracking-wider">Family Distribution</h3><div className="flex-grow relative"><OlfactoryMindmap molecules={moleculesInFormula} /></div><div className="flex-shrink-0 pt-3"><MindmapLegend familyCounts={familyCounts} /></div></div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px] space-y-3">
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                                    <div className="col-span-3">Material</div>
                                    <div className="col-span-2 text-right">Dilution</div>
                                    <div className="col-span-2 text-right">Quantity</div>
                                    <div className="col-span-2 text-right">Weight</div>
                                    <div className="col-span-2 text-right">Cost</div>
                                    <div className="col-span-1 text-center">Status</div>
                                </div>
                                {editedFormula.ingredients.map((ing, index) => {
                                    const molecule = molecules.find(m => m.id === ing.moleculeId);
                                    const comp = formulaAnalysis.complianceMap.get(ing.moleculeId);
                                    const totalConcentrateWeight = (editedFormula.finalDilution / 100) * finishedPerfumeWeight;
                                    const weightOfIngredientAdded = editedFormula.unit === 'weight' ? (ing.amount / 100) * totalConcentrateWeight : 0;
                                    const weightOfRawMaterial = editedFormula.unit === 'weight' ? weightOfIngredientAdded * (ing.myDilution / 100) : 0;
                                    const costPerIngredient = editedFormula.unit === 'weight' && molecule?.avgCostPerGram ? weightOfRawMaterial * molecule.avgCostPerGram : 0;
                                    const isFail = comp?.status === 'FAIL';

                                    return (
                                        <div key={ing.moleculeId + '-' + index} className="grid grid-cols-12 gap-4 items-center bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-sm dark:shadow-none">
                                            <div className="col-span-3 flex items-center space-x-2" onMouseEnter={(e) => handleMouseEnter(e, ing.moleculeId)} onMouseLeave={handleMouseLeave}>
                                                <MaterialSelector molecules={molecules} value={ing.moleculeId} onChange={moleculeId => handleIngredientChange(index, 'moleculeId', moleculeId)} />
                                            </div>
                                            <div className="col-span-2 flex items-center justify-end space-x-1">
                                                <input type="number" value={ing.myDilution} onChange={e => handleIngredientChange(index, 'myDilution', e.target.value)} max="100" min="0" className="bg-transparent border-0 focus:ring-0 p-0 text-right w-12 text-gray-900 dark:text-white font-mono" />
                                                <span className="text-gray-500 text-xs">%</span>
                                                {ing.myDilution < 100 && (<select value={ing.solventId || ''} onChange={e => handleIngredientChange(index, 'solventId', e.target.value)} className="bg-transparent text-[#a89984] text-xs font-bold focus:outline-none w-16 ml-1"><option value="">Solv.</option>{solventOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>)}
                                            </div>
                                            <div className="col-span-2 flex items-center justify-end">
                                                <input type="number" value={ing.amount} onChange={e => handleIngredientChange(index, 'amount', e.target.value)} step={editedFormula.unit === 'weight' ? '0.01' : '1'} className="bg-transparent border-0 focus:ring-0 p-0 text-right w-20 text-gray-900 dark:text-white font-mono font-bold" />
                                                <span className="text-gray-500 text-xs ml-1">{editedFormula.unit === 'weight' ? '%' : 'dr'}</span>
                                            </div>
                                            <div className="col-span-2 text-right font-mono text-gray-700 dark:text-gray-300 text-sm">
                                                {editedFormula.unit === 'weight' ? (<input type="number" value={Math.round(weightOfIngredientAdded * 10000) / 10000} onChange={e => handleIngredientWeightChange(index, e.target.value)} className="bg-transparent border-0 focus:ring-0 p-0 text-right w-20 font-mono" step="0.001" />) : 'N/A'}
                                            </div>
                                            <div className="col-span-2 text-right font-mono text-gray-900 dark:text-white text-sm">
                                                {editedFormula.unit === 'weight' ? `${currencySymbol}${costPerIngredient.toFixed(4)}` : 'N/A'}
                                            </div>
                                            <div className="col-span-1 flex justify-center items-center space-x-2">
                                                 <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full uppercase ${isFail ? 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50' : comp?.status === 'N/A' ? 'text-gray-500 bg-gray-200 dark:text-gray-400 dark:bg-gray-700' : 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/50'}`}>{comp?.status}</span>
                                                 <button onClick={() => handleRequestDeleteIngredient(index)} className="text-red-400 hover:text-red-600 dark:hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity">&times;</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="text-sm space-y-2">
                                <div><h4 className="font-bold mb-1 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">Compliance Summary</h4>{editedFormula.unit === 'weight' ? (<div className={`flex items-center space-x-2 ${formulaAnalysis.nonCompliantCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}><span>Overall Status: {formulaAnalysis.nonCompliantCount > 0 ? 'FAIL' : 'PASS'}</span>{formulaAnalysis.nonCompliantCount > 0 && <span>({formulaAnalysis.nonCompliantCount} non-compliant)</span>}</div>) : (<p className="text-gray-500">Not available for drop-based formulas.</p>)}</div>
                                {Object.keys(formulaAnalysis.hiddenSolvents).length > 0 && (<div><h4 className="font-bold mb-1 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">Hidden Solvents</h4><div className="text-gray-600 dark:text-gray-300 space-y-1">{Object.entries(formulaAnalysis.hiddenSolvents).map(([name, weight]) => (<div key={name} className="flex justify-between w-64 text-xs"><span>{name}</span><span className="font-mono text-gray-500">{(weight as number).toFixed(3)}g</span></div>))}</div></div>)}
                            </div>
                             <div className="text-right font-mono text-sm w-full md:w-auto">
                                 <h4 className="font-bold mb-2 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider text-left md:text-right">Formula Totals</h4>
                                 {editedFormula.unit === 'weight' ? (
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
                                        <span className="text-gray-500 dark:text-gray-400 text-left">Total Concentration %:</span> 
                                        <span className="text-gray-900 dark:text-white font-bold">{(editedFormula.ingredients.reduce((acc, ing) => acc + ing.amount, 0)).toFixed(2)}%</span>
                                        
                                        <span className="text-gray-500 dark:text-gray-400 text-left">Total Cost:</span> 
                                        <span className="text-gray-900 dark:text-white font-bold">{currencySymbol}{formulaAnalysis.totals.rawMaterialCost.toFixed(2)}</span>
                                        
                                        <span className="text-gray-500 dark:text-gray-400 text-left">Finished Cost / g:</span> 
                                        <span className="text-gray-900 dark:text-white font-bold">{currencySymbol}{(formulaAnalysis.totals.rawMaterialCost / finishedPerfumeWeight || 0).toFixed(3)}</span>
                                        
                                        <span className="text-gray-500 dark:text-gray-400 text-left text-[#a89984]">Concentrate Cost / kg:</span> 
                                        <span className="text-[#a89984] font-bold text-lg">{currencySymbol}{((formulaAnalysis.totals.rawMaterialCost / (formulaAnalysis.totals.concentrateWeight || 1)) * 1000).toFixed(2)}</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1"><span className="text-gray-500 dark:text-gray-400 text-left">Total Drops:</span> <span className="text-gray-900 dark:text-white">{formulaAnalysis.totals.totalDrops}</span></div>
                                )}
                            </div>
                        </div>

                         <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800/50 gap-4">
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-2 sm:order-1">
                                <button onClick={handleAddIngredient} className="w-full sm:w-auto bg-[#a89984] hover:bg-[#a89984]/90 text-black font-bold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-md transform hover:scale-105">Add Ingredient</button>
                                <button onClick={handleCreateNewFormula} className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm">Create New</button>
                                <button onClick={handleExportPDF} className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm">Export Recipe</button>
                                <button onClick={handleSaveFormula} className="w-full sm:w-auto border border-[#a89984] text-[#a89984] hover:bg-[#a89984]/10 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm">Save Changes</button>
                            </div>
                            <button onClick={() => onDelete(editedFormula)} className="w-full sm:w-auto border border-red-200 dark:border-red-900 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm order-1 sm:order-2">Delete Formula</button>
                        </div>

                        {/* EVALUATIONS SECTION - MOVED TO BOTTOM */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
                            <h4 className="font-bold text-[#a89984] uppercase text-sm tracking-wider mb-4 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Evaluations & Maceration Log</h4>
                            
                            <div className="bg-white dark:bg-[#1C1C1C] p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                                        <select value={newEvalStatus} onChange={(e) => setNewEvalStatus(e.target.value as any)} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#a89984]"><option value="Fresh">Fresh (Immediate)</option><option value="1 Day">1 Day Maceration</option><option value="1 Week">1 Week Maceration</option><option value="2 Weeks">2 Weeks Maceration</option><option value="1 Month+">1 Month+ Maceration</option></select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Score (1-10)</label>
                                        <input type="number" min="1" max="10" value={newEvalScore} onChange={(e) => setNewEvalScore(parseInt(e.target.value))} className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#a89984]" />
                                    </div>
                                    <div className="md:col-span-5">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Notes</label>
                                        <input type="text" value={newEvalNotes} onChange={(e) => setNewEvalNotes(e.target.value)} placeholder="Scent impression..." className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#a89984]" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button onClick={handleAddEvaluation} disabled={!newEvalNotes} className="w-full bg-[#a89984] hover:bg-[#a89984]/90 text-black font-bold py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Add Log</button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {(editedFormula.evaluations || []).length > 0 ? ((editedFormula.evaluations || []).slice().reverse().map(ev => (
                                    <div key={ev.id} className="bg-white dark:bg-[#1C1C1C] border-l-4 border-[#a89984] rounded-r-lg p-4 relative group shadow-sm dark:shadow-none flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <span className="font-bold text-gray-900 dark:text-white text-sm">{ev.status}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(ev.date).toLocaleDateString()}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${ev.score >= 8 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ev.score >= 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>Score: {ev.score}/10</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{ev.notes}</p>
                                        </div>
                                        <button onClick={() => handleDeleteEvaluation(ev.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl leading-none">&times;</button>
                                    </div>
                                ))) : (<div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg"><p className="text-sm text-gray-500">No evaluations recorded yet.</p></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-center text-gray-500 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg h-96"><p>Loading formula...</p></div>
            )}
        </div>
    );
};

export default React.memo(FormularyView);
