
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Formula, Molecule, PackagingCategory, FinishedProduct, PackagingSelection } from '../../types';

interface ProductStudioViewProps {
    formulas: Formula[];
    molecules: Molecule[];
    products: FinishedProduct[];
    onSaveProduct: (product: FinishedProduct) => void;
    onDeleteProduct: (product: FinishedProduct) => void;
    currencySymbol: string;
}

const ProductStudioView: React.FC<ProductStudioViewProps> = ({ formulas, molecules, products, onSaveProduct, onDeleteProduct, currencySymbol }) => {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [productName, setProductName] = useState<string>('New Product');
    
    const [isInternalFormula, setIsInternalFormula] = useState<boolean>(true);
    const [selectedFormulaId, setSelectedFormulaId] = useState<string>('');
    const [manualJuiceCost, setManualJuiceCost] = useState<number>(0);

    const [bottleVolume, setBottleVolume] = useState<number>(50);
    const [concentration, setConcentration] = useState<number>(15);
    const [alcoholCostPerKg, setAlcoholCostPerKg] = useState<number>(15);
    const [laborCost, setLaborCost] = useState<number>(2.00);
    const [overheadCost, setOverheadCost] = useState<number>(1.00);
    const [retailPrice, setRetailPrice] = useState<number>(120.00);
    const [desiredMargin, setDesiredMargin] = useState<number>(0);
    
    const [selectedPackaging, setSelectedPackaging] = useState<Record<PackagingCategory, PackagingSelection | null>>({
        [PackagingCategory.BOTTLE]: null,
        [PackagingCategory.PUMP]: null,
        [PackagingCategory.CAP]: null,
        [PackagingCategory.LABEL]: null,
        [PackagingCategory.BOX]: null,
        [PackagingCategory.OTHER]: null,
    });

    const [customPackaging, setCustomPackaging] = useState<PackagingSelection[]>([]);
    const [customCosts, setCustomCosts] = useState<{ id: string; name: string; cost: number }[]>([]);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    useEffect(() => {
        if (selectedProductId) {
            const product = products.find(p => p.id === selectedProductId);
            if (product) {
                setProductName(product.name);
                if (product.formulaId === 'manual-external') {
                    setIsInternalFormula(false);
                    setManualJuiceCost(product.customCosts.find(c => c.id === 'manual-juice-cost')?.cost || 0);
                    setSelectedFormulaId('');
                } else {
                    setIsInternalFormula(true);
                    setSelectedFormulaId(product.formulaId);
                }
                setBottleVolume(product.bottleSize);
                setConcentration(product.concentration);
                setAlcoholCostPerKg(product.alcoholCostPerKg);
                setLaborCost(product.laborCost);
                setOverheadCost(product.overheadCost);
                setRetailPrice(product.retailPrice);
                setSelectedPackaging(product.packaging);
                setCustomPackaging(product.customPackaging || []);
                setCustomCosts(product.customCosts.filter(c => c.id !== 'manual-juice-cost') || []);
            }
        }
    }, [selectedProductId, products]);

    const handleCreateNewProduct = useCallback(() => {
        setSelectedProductId(null);
        setProductName('New Product');
        setIsInternalFormula(true);
        setSelectedFormulaId('');
        setManualJuiceCost(0);
        setBottleVolume(50);
        setConcentration(15);
        setAlcoholCostPerKg(15);
        setLaborCost(2.00);
        setOverheadCost(1.00);
        setRetailPrice(120.00);
        setSelectedPackaging({
            [PackagingCategory.BOTTLE]: null, [PackagingCategory.PUMP]: null, [PackagingCategory.CAP]: null,
            [PackagingCategory.LABEL]: null, [PackagingCategory.BOX]: null, [PackagingCategory.OTHER]: null,
        });
        setCustomPackaging([]);
        setCustomCosts([]);
    }, []);

    const handleSave = useCallback(() => {
        if (isInternalFormula && !selectedFormulaId) return;
        let finalCustomCosts = [...customCosts];
        if (!isInternalFormula) {
             finalCustomCosts = finalCustomCosts.filter(c => c.id !== 'manual-juice-cost');
             finalCustomCosts.push({ id: 'manual-juice-cost', name: '__MANUAL_JUICE_COST__', cost: manualJuiceCost });
        }
        const newProduct: FinishedProduct = {
            id: selectedProductId || `prod-${Date.now()}`,
            name: productName,
            formulaId: isInternalFormula ? selectedFormulaId : 'manual-external',
            bottleSize: bottleVolume,
            concentration: concentration,
            alcoholCostPerKg: alcoholCostPerKg,
            laborCost: laborCost,
            overheadCost: overheadCost,
            retailPrice: retailPrice,
            packaging: selectedPackaging,
            customPackaging: customPackaging,
            customCosts: finalCustomCosts,
            createdAt: new Date().toISOString(),
        };
        onSaveProduct(newProduct);
        setSelectedProductId(newProduct.id);
        setShowSaveConfirmation(true);
        setTimeout(() => setShowSaveConfirmation(false), 3000);
    }, [isInternalFormula, selectedFormulaId, customCosts, manualJuiceCost, selectedProductId, productName, bottleVolume, concentration, alcoholCostPerKg, laborCost, overheadCost, retailPrice, selectedPackaging, customPackaging, onSaveProduct]);

    const selectedFormula = useMemo(() => formulas.find(f => f.id === selectedFormulaId), [formulas, selectedFormulaId]);

    const calculations = useMemo(() => {
        let juiceCostPerKg = 0;
        if (isInternalFormula) {
            if (selectedFormula) {
                let totalCost = 0;
                let totalWeight = 0;
                selectedFormula.ingredients.forEach(ing => {
                    const molecule = molecules.find(m => m.id === ing.moleculeId);
                    if (molecule?.avgCostPerGram) {
                        totalCost += ing.amount * molecule.avgCostPerGram * 1000;
                        totalWeight += ing.amount;
                    }
                });
                if (totalWeight > 0) juiceCostPerKg = totalCost / totalWeight;
            }
        } else {
            juiceCostPerKg = manualJuiceCost;
        }

        const specificGravity = 0.85; 
        const weightInKg = (bottleVolume * specificGravity) / 1000;
        const concentrateWeight = weightInKg * (concentration / 100);
        const alcoholWeight = weightInKg * (1 - (concentration / 100));
        const costOfConcentrate = concentrateWeight * juiceCostPerKg;
        const costOfAlcohol = alcoholWeight * alcoholCostPerKg;
        const totalJuiceCost = costOfConcentrate + costOfAlcohol;

        let totalPackagingCost = 0;
        (Object.values(selectedPackaging) as (PackagingSelection | null)[]).forEach((item) => { if (item) totalPackagingCost += item.cost; });
        customPackaging.forEach(item => totalPackagingCost += item.cost);

        let totalProductionCost = laborCost + overheadCost;
        customCosts.forEach(item => totalProductionCost += item.cost);

        const totalCOGS = totalJuiceCost + totalPackagingCost + totalProductionCost;
        const profit = retailPrice - totalCOGS;
        const margin = retailPrice > 0 ? (profit / retailPrice) * 100 : 0;
        const markup = totalCOGS > 0 ? (retailPrice / totalCOGS) : 0;

        return { juiceCostPerKg, costOfConcentrate, costOfAlcohol, totalJuiceCost, totalPackagingCost, totalProductionCost, totalCOGS, profit, margin, markup };
    }, [isInternalFormula, selectedFormula, manualJuiceCost, molecules, bottleVolume, concentration, alcoholCostPerKg, selectedPackaging, customPackaging, laborCost, overheadCost, customCosts, retailPrice]);

    useEffect(() => {
        setDesiredMargin(parseFloat(calculations.margin.toFixed(1)));
    }, [calculations.margin]);

    const handlePackagingChange = useCallback((category: PackagingCategory, field: keyof PackagingSelection, value: string | number) => {
        setSelectedPackaging(prev => {
            const current = prev[category] || { componentId: `custom-${Date.now()}`, name: '', cost: 0 };
            return { ...prev, [category]: { ...current, [field]: value } };
        });
    }, []);

    const handleClearComponent = useCallback((category: PackagingCategory) => setSelectedPackaging(prev => ({ ...prev, [category]: null })), []);
    const handleAddCustomPackaging = useCallback(() => setCustomPackaging(prev => [...prev, { componentId: `extra-pkg-${Date.now()}`, name: '', cost: 0 }]), []);
    const handleCustomPackagingChange = useCallback((index: number, field: keyof PackagingSelection, value: string | number) => {
        setCustomPackaging(prev => {
            const updated = [...prev];
            // @ts-ignore
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);
    const handleRemoveCustomPackaging = useCallback((index: number) => setCustomPackaging(prev => prev.filter((_, i) => i !== index)), []);
    const handleAddCustomCost = useCallback(() => setCustomCosts(prev => [...prev, { id: `cost-${Date.now()}`, name: '', cost: 0 }]), []);
    const handleCustomCostChange = useCallback((index: number, field: 'name' | 'cost', value: string | number) => {
        setCustomCosts(prev => {
            const updated = [...prev];
            // @ts-ignore
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);
    const handleRemoveCustomCost = useCallback((index: number) => setCustomCosts(prev => prev.filter((_, i) => i !== index)), []);

    const handleDesiredMarginChange = useCallback((newMargin: number) => {
        setDesiredMargin(newMargin);
        const decimalMargin = newMargin / 100;
        if (decimalMargin < 1) {
            const newPrice = calculations.totalCOGS / (1 - decimalMargin);
            setRetailPrice(newPrice);
        }
    }, [calculations.totalCOGS]);

    const fixedCategories = [PackagingCategory.BOTTLE, PackagingCategory.PUMP, PackagingCategory.CAP, PackagingCategory.LABEL, PackagingCategory.BOX];

    if (!selectedProductId && products.length > 0) {
        return (
            <div className="animate-fade-in pt-12">
                <div className="flex justify-between items-center mb-6">
                    <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Studio</h1><p className="text-gray-500 dark:text-gray-400 mt-1">Manage your finished products and pricing.</p></div>
                    <button onClick={handleCreateNewProduct} className="border border-[#a89984] text-[#a89984] hover:bg-[#a89984]/10 font-semibold py-2 px-4 rounded-md transition-colors text-sm">Create New Product</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                        <div key={product.id} onClick={() => setSelectedProductId(product.id)} className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-[#a89984] transition-colors cursor-pointer group shadow-sm dark:shadow-none">
                            <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#a89984] transition-colors">{product.name}</h3><span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{product.bottleSize}ml</span></div>
                            <p className="text-sm text-gray-500 mb-4 truncate">Formula: {product.formulaId === 'manual-external' ? 'External Juice' : (formulas.find(f => f.id === product.formulaId)?.name || 'Unknown')}</p>
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-800 pt-3"><div><p className="text-xs text-gray-500">Unit Cost</p><p className="font-mono text-gray-900 dark:text-white">{currencySymbol}{((product.retailPrice * 0.2) || 0).toFixed(2)}+</p></div><div className="text-right"><p className="text-xs text-gray-500">Retail Price</p><p className="font-mono text-[#a89984] font-bold">{currencySymbol}{product.retailPrice.toFixed(2)}</p></div></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pt-12 pb-12 max-w-7xl mx-auto relative">
            {showSaveConfirmation && (<div className="fixed bottom-6 right-6 z-50 bg-[#a89984] text-black px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span className="font-bold">Product Saved</span></div>)}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div className="flex items-center space-x-4"><button onClick={() => setSelectedProductId(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Studio</h1><p className="text-gray-500 dark:text-gray-400 mt-1">{selectedProductId ? 'Edit Product' : 'New Product Analysis'}</p></div></div>
                <div className="flex space-x-2 mt-4 md:mt-0">{selectedProductId && (<button onClick={() => { const prod = products.find(p => p.id === selectedProductId); if(prod) { onDeleteProduct(prod); setSelectedProductId(null); }}} className="border border-red-900 text-red-500 hover:bg-red-900/20 font-semibold py-2 px-4 rounded-md transition-colors text-sm">Delete</button>)}<button onClick={handleCreateNewProduct} className="border border-[#a89984] text-[#a89984] hover:bg-[#a89984]/10 font-semibold py-2 px-4 rounded-md transition-colors text-sm">New</button></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm dark:shadow-none">
                        <h3 className="text-[#a89984] font-bold uppercase text-sm tracking-wider mb-4">1. Define Product</h3>
                        <div className="grid grid-cols-1 gap-4 mb-4"><div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Product Name</label><input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white text-lg font-semibold py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" placeholder="e.g. Summer Citrus - 50ml" /></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Juice Source</label><div className="flex bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-700 rounded-md p-1"><button onClick={() => setIsInternalFormula(true)} className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${isInternalFormula ? 'bg-[#a89984] text-black' : 'text-gray-500 dark:text-gray-400'}`}>Internal</button><button onClick={() => setIsInternalFormula(false)} className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${!isInternalFormula ? 'bg-[#a89984] text-black' : 'text-gray-500 dark:text-gray-400'}`}>External</button></div></div>
                            <div className="md:col-span-2">{isInternalFormula ? (<div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fragrance Formula</label><select value={selectedFormulaId} onChange={(e) => setSelectedFormulaId(e.target.value)} className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#a89984]"><option value="">Select a formula...</option>{formulas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>) : (<div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Concentrate Cost ({currencySymbol}/kg)</label><input type="number" value={manualJuiceCost} onChange={(e) => setManualJuiceCost(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" placeholder="Cost per Kg of Oil" min="0" /></div>)}</div>
                            <div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bottle Size (ml)</label><input type="number" value={bottleVolume} onChange={(e) => setBottleVolume(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" min="0" /></div>
                            <div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Concentration (%)</label><input type="number" value={concentration} onChange={(e) => setConcentration(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" min="0" /></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm dark:shadow-none">
                        <h3 className="text-[#a89984] font-bold uppercase text-sm tracking-wider mb-4">2. Packaging Components</h3>
                        <div className="space-y-2">
                            {fixedCategories.map(category => {
                                const selection = selectedPackaging[category];
                                return (
                                    <div key={category} className={`p-3 rounded-lg transition-colors ${!!selection ? 'bg-[#a89984]/10' : 'bg-gray-50 dark:bg-[#111]/50'}`}>
                                        <div className="flex flex-col md:flex-row md:items-center gap-4"><div className="w-24 flex-shrink-0"><span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{category}</span></div><div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4"><div className="md:col-span-2"><input type="text" placeholder={`Enter ${category} Name`} value={selection?.name || ''} onChange={(e) => handlePackagingChange(category, 'name', e.target.value)} className="w-full bg-transparent border-none focus:border-none text-gray-900 dark:text-white text-sm py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" /></div><div className="relative"><span className="absolute left-0 top-1 text-gray-500 text-sm">{currencySymbol}</span><input type="number" placeholder="0.00" value={selection?.cost === undefined ? '' : selection.cost} onChange={(e) => handlePackagingChange(category, 'cost', Math.max(0, parseFloat(e.target.value)))} className="w-full bg-transparent border-none focus:border-none text-gray-900 dark:text-white text-sm py-1 pl-5 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 font-mono text-right" step="0.01" min="0" /></div></div>{!!selection && (<div className="w-6 flex justify-center"><button onClick={() => handleClearComponent(category)} className="text-red-500 hover:text-red-400 font-bold text-lg leading-none" title="Clear">&times;</button></div>)}</div>
                                    </div>
                                );
                            })}
                            {customPackaging.map((item, index) => (<div key={index} className="p-3 rounded-lg bg-[#a89984]/10"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="w-24 flex-shrink-0"><span className="text-xs font-bold text-[#a89984] uppercase tracking-wider">Custom</span></div><div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4"><div className="md:col-span-2"><input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleCustomPackagingChange(index, 'name', e.target.value)} className="w-full bg-transparent border-none focus:border-none text-gray-900 dark:text-white text-sm py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" /></div><div className="relative"><span className="absolute left-0 top-1 text-gray-500 text-sm">{currencySymbol}</span><input type="number" placeholder="0.00" value={item.cost} onChange={(e) => handleCustomPackagingChange(index, 'cost', Math.max(0, parseFloat(e.target.value)))} className="w-full bg-transparent border-none focus:border-none text-gray-900 dark:text-white text-sm py-1 pl-5 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 font-mono text-right" step="0.01" min="0" /></div></div><div className="w-6 flex justify-center"><button onClick={() => handleRemoveCustomPackaging(index)} className="text-red-500 hover:text-red-400 font-bold text-lg leading-none" title="Remove">&times;</button></div></div></div>))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end"><button onClick={handleAddCustomPackaging} className="text-xs font-bold text-[#a89984] hover:text-white uppercase tracking-wider flex items-center"><span className="text-lg mr-1">+</span> Add Component</button></div>
                    </div>
                    <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm dark:shadow-none">
                        <h3 className="text-[#a89984] font-bold uppercase text-sm tracking-wider mb-4">3. Production Costs</h3>
                        <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#111]/50"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="w-32 flex-shrink-0"><span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Juice Concentrate</span></div><div className="flex-grow"><span className="text-sm text-gray-500 italic">{isInternalFormula ? (selectedFormula ? selectedFormula.name : 'No Formula Selected') : 'External / Manual Input'}</span></div><div className="relative w-24"><span className="absolute left-0 top-1 text-gray-500 text-sm">{currencySymbol}</span><input disabled type="text" value={calculations.costOfConcentrate.toFixed(2)} className="w-full bg-transparent border-b border-transparent text-gray-500 text-sm py-1 pl-5 font-mono text-right cursor-not-allowed" /></div><div className="w-6"></div></div></div>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#111]/50"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="w-32 flex-shrink-0"><span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alcohol / Solvent</span></div><div className="flex-grow grid grid-cols-1 gap-4"><div className="flex items-center space-x-2"><span className="text-xs text-gray-500">Cost / kg:</span><div className="relative w-24"><span className="absolute left-1 top-0.5 text-gray-600 text-xs">{currencySymbol}</span><input type="number" value={alcoholCostPerKg} onChange={(e) => setAlcoholCostPerKg(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent border border-gray-700 rounded px-2 py-0.5 text-xs text-gray-900 dark:text-white pl-4 focus:outline-none focus:border-[#a89984]" min="0" /></div></div></div><div className="relative w-24"><span className="absolute left-0 top-1 text-gray-500 text-sm">{currencySymbol}</span><input disabled type="text" value={calculations.costOfAlcohol.toFixed(2)} className="w-full bg-transparent border-b border-transparent text-gray-900 dark:text-white text-sm py-1 pl-5 font-mono text-right" /></div><div className="w-6"></div></div></div>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#111]/50"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="w-32 flex-shrink-0"><span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Labor</span></div><div className="flex-grow"><input type="text" placeholder="Description" className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white text-sm py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" /></div><div className="relative w-24"><span className="absolute left-0 top-1 text-gray-500 text-sm">{currencySymbol}</span><input type="number" value={laborCost} onChange={(e) => setLaborCost(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white text-sm py-1 pl-5 focus:outline-none font-mono text-right" min="0" /></div><div className="w-6"></div></div></div>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#111]/50"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="w-32 flex-shrink-0"><span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Equipment</span></div><div className="flex-grow"><input type="text" placeholder="Description" className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white text-sm py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" /></div><div className="relative w-24"><span className="absolute left-0 top-1 text-gray-500 text-sm">{currencySymbol}</span><input type="number" value={overheadCost} onChange={(e) => setOverheadCost(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white text-sm py-1 pl-5 focus:outline-none font-mono text-right" min="0" /></div><div className="w-6"></div></div></div>
                            {customCosts.map((item, index) => (<div key={index} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/30"><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="w-32 flex-shrink-0"><span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Other</span></div><div className="flex-grow"><input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleCustomCostChange(index, 'name', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white text-sm py-1 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600" /></div><div className="relative w-24"><span className="absolute left-0 top-1 text-gray-500 text-sm">{currencySymbol}</span><input type="number" value={item.cost} onChange={(e) => handleCustomCostChange(index, 'cost', Math.max(0, parseFloat(e.target.value)))} className="w-full bg-transparent border-b border-transparent focus:border-[#a89984] text-gray-900 dark:text-white text-sm py-1 pl-5 focus:outline-none font-mono text-right" min="0" /></div><div className="w-6 flex justify-center"><button onClick={() => handleRemoveCustomCost(index)} className="text-red-500 hover:text-red-400 font-bold text-lg leading-none" title="Remove">&times;</button></div></div></div>))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end"><button onClick={handleAddCustomCost} className="text-xs font-bold text-[#a89984] hover:text-white uppercase tracking-wider flex items-center"><span className="text-lg mr-1">+</span> Add Cost</button></div>
                    </div>
                </div>
                <div className="lg:col-span-1"><div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-6 sticky top-6 shadow-sm dark:shadow-none"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Pricing Breakdown</h3><div className="space-y-3 mb-8"><div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Total Juice Cost</span><span className="text-gray-900 dark:text-white">{currencySymbol}{calculations.totalJuiceCost.toFixed(2)}</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5"><div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${(calculations.totalJuiceCost / calculations.totalCOGS) * 100}%` }}></div></div><div className="flex justify-between text-sm mt-2"><span className="text-gray-500 dark:text-gray-400">Total Packaging</span><span className="text-gray-900 dark:text-white">{currencySymbol}{calculations.totalPackagingCost.toFixed(2)}</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(calculations.totalPackagingCost / calculations.totalCOGS) * 100}%` }}></div></div><div className="flex justify-between text-sm mt-2"><span className="text-gray-500 dark:text-gray-400">Production Costs</span><span className="text-gray-900 dark:text-white">{currencySymbol}{calculations.totalProductionCost.toFixed(2)}</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(calculations.totalProductionCost / calculations.totalCOGS) * 100}%` }}></div></div></div><div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6"><div className="flex justify-between items-end"><span className="text-gray-500 dark:text-gray-400 font-medium">Total Unit Cost (COGS)</span><span className="text-2xl font-bold text-gray-900 dark:text-white">{currencySymbol}{calculations.totalCOGS.toFixed(2)}</span></div></div><div className="bg-gray-50 dark:bg-[#111] rounded-lg p-4 space-y-4 border border-gray-200 dark:border-gray-800"><div className="space-y-1"><label className="text-xs font-bold text-[#a89984] uppercase tracking-wider">Desired Profit Margin (%)</label><input type="number" value={desiredMargin} onChange={(e) => handleDesiredMarginChange(Number(e.target.value))} className="w-full bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white focus:border-[#a89984] focus:outline-none text-right" /></div><div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-800"><label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Final Selling Price</label><div className="relative"><span className="absolute left-3 top-2 text-gray-900 dark:text-white text-lg font-bold">{currencySymbol}</span><input type="number" value={retailPrice} onChange={(e) => setRetailPrice(Math.max(0, Number(e.target.value)))} className="w-full bg-white dark:bg-[#1C1C1C] border border-[#a89984] rounded p-2 pl-8 text-gray-900 dark:text-white text-xl font-bold focus:outline-none text-right" min="0" /></div></div><div className="flex justify-between text-sm pt-2 text-gray-500 dark:text-gray-400"><span>Net Profit per Unit</span><span className={`font-bold ${calculations.profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{currencySymbol}{calculations.profit.toFixed(2)}</span></div></div><button onClick={handleSave} className="w-full mt-6 border border-[#a89984] text-[#a89984] hover:bg-[#a89984]/10 font-bold py-3 rounded-lg transition-colors shadow-lg">Save Product</button></div></div>
            </div>
        </div>
    );
};

export default React.memo(ProductStudioView);
