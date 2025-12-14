
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Molecule, InventoryBatch, OlfactiveFamily, FunctionalRole, ScentFacet, MoleculeOrigin, PhysicalState } from '../../types';
import { SCENT_FACETS, MOLECULE_ROLES } from '../../constants';
import BaseModal from '../ui/BaseModal';

type EditMode = 
    | 'add'
    | 'edit-header'
    | 'edit-metrics'
    | 'edit-functional-role'
    | 'edit-tech-data'
    | 'edit-inventory'
    | 'edit-scent-dna'
    | 'edit-evaporation-curve';

interface AddMoleculeModalProps {
    moleculeToEdit?: Molecule | null;
    onSave: (molecule: Molecule) => void;
    onClose: () => void;
    mode?: EditMode;
    initialData?: Partial<Molecule> | null;
    currencySymbol: string;
    onScanTDS?: () => void;
}

const emptyMolecule: Omit<Molecule, 'id'> = {
    name: '',
    olfactiveFamily: OlfactiveFamily.CITRUS,
    roles: [],
    functionalRole: [],
    casNumber: '',
    iupacName: '',
    odorStrength: 5,
    impact: 24,
    scentDNA: {
        [ScentFacet.FRUITY]: 3,
        [ScentFacet.FLORAL]: 3,
        [ScentFacet.GREEN]: 3,
    },
    evaporationCurve: [100, 80, 50, 20, 5, 0],
    synergies: [],
    IFRA_MAX_CONCENTRATION: 100,
    inventoryBatches: [],
    createdAt: new Date().toISOString(),
};


const HeaderFields = ({ molecule, handleChange, handleRoleChange }: { molecule: Molecule, handleChange: any, handleRoleChange: (role: string) => void }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400">Name</label>
                <input type="text" name="name" value={molecule.name} onChange={handleChange} className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400">Olfactive Family</label>
                <select name="olfactiveFamily" value={molecule.olfactiveFamily} onChange={handleChange} className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2">
                    {Object.values(OlfactiveFamily).map(family => <option key={family} value={family}>{family}</option>)}
                </select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Note Role(s)</label>
            <div className="flex flex-wrap gap-2">
                {MOLECULE_ROLES.map(role => (
                    <button
                        type="button"
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            molecule.roles?.includes(role)
                                ? 'bg-[#a89984] text-black font-semibold'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {role}
                    </button>
                ))}
            </div>
        </div>
    </>
);

const MetricsFields = ({ molecule, handleNumberChange }: { molecule: Molecule, handleNumberChange: any }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="text-sm text-gray-400">Impact (1-10)</label>
            <p className="text-xs text-gray-500 mt-1">How strong it feels on first smell. E.g., aldehydes are high impact; musks are low impact.</p>
            <input type="number" name="odorStrength" value={molecule.odorStrength} onChange={handleNumberChange} min="1" max="10" className="w-full bg-[#111] border-gray-700 rounded px-4 py-2 mt-2" />
        </div>
        <div>
            <label className="text-sm text-gray-400">Tenacity / Longevity (in hours)</label>
            <p className="text-xs text-gray-500 mt-1">How long the scent lasts. E.g., ISO E Super → 72–96 hours; Limonene → 30–60 minutes.</p>
            <input type="number" name="impact" value={molecule.impact} onChange={handleNumberChange} className="w-full bg-[#111] border-gray-700 rounded px-4 py-2 mt-2" />
        </div>
    </div>
);


const FunctionalRoleFields = ({ molecule, handleFunctionalRoleChange }: { molecule: Molecule, handleFunctionalRoleChange: any }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Functional Role(s)</label>
        <div className="flex flex-wrap gap-2">
            {Object.values(FunctionalRole).map(role => (
                <button
                    type="button"
                    key={role}
                    onClick={() => handleFunctionalRoleChange(role)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        molecule.functionalRole?.includes(role)
                            ? 'bg-[#a89984] text-black font-semibold'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {role}
                </button>
            ))}
        </div>
    </div>
);

const TechDataFields = ({ molecule, setMolecule, handleChange, handleNumberChange }: { molecule: Molecule, setMolecule: React.Dispatch<React.SetStateAction<Molecule>>, handleChange: any, handleNumberChange: any }) => {
    const [uploadType, setUploadType] = useState<'file' | 'link'>(molecule.sdsUrl ? 'link' : 'file');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target?.result as string;
                setMolecule(prev => {
                    const newMol = { 
                        ...prev, 
                        sdsFilename: file.name,
                        sdsFileContent: fileContent 
                    };
                    delete newMol.sdsUrl; // Ensure only one is set
                    return newMol;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        setMolecule(prev => {
            const newMol = { ...prev, sdsUrl: url };
            delete newMol.sdsFilename;
            delete newMol.sdsFileContent;
            return newMol;
        });
    };

    const handleUrlBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        if (url.trim() === '') {
            setMolecule(prev => {
                const newMol = { ...prev };
                delete newMol.sdsUrl;
                return newMol;
            });
        }
    };

    const handleRemoveSds = () => {
        setMolecule(prev => {
            const newMol = { ...prev };
            delete newMol.sdsFilename;
            delete newMol.sdsFileContent;
            delete newMol.sdsUrl;
            return newMol;
        });
    };

    const triggerFilePicker = () => {
        fileInputRef.current?.click();
    };


    return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-400">Material Origin</label>
            <select name="origin" value={molecule.origin || ''} onChange={handleChange} className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2">
                <option value="">Select Origin...</option>
                {Object.values(MoleculeOrigin).map(origin => <option key={origin} value={origin}>{origin}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400">Physical State</label>
            <select name="physicalState" value={molecule.physicalState || ''} onChange={handleChange} className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2">
                <option value="">Select State...</option>
                {Object.values(PhysicalState).map(state => <option key={state} value={state}>{state}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400">CAS Number</label>
            <input type="text" name="casNumber" value={molecule.casNumber || ''} onChange={handleChange} className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400">IUPAC Name</label>
            <input type="text" name="iupacName" value={molecule.iupacName || ''} onChange={handleChange} className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400">IFRA Max %</label>
            <p className="text-xs text-gray-500 mt-1">Maximum allowed concentration in a final product according to IFRA standards.</p>
            <input type="number" name="IFRA_MAX_CONCENTRATION" step="0.01" value={molecule.IFRA_MAX_CONCENTRATION} onChange={handleNumberChange} className="mt-1 block w-full bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2" />
        </div>
        <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-400">Safety Data Sheet (SDS/MSDS)</label>
            
             <div className="flex border-b border-gray-700">
                <button type="button" onClick={() => setUploadType('file')} className={`px-4 py-2 text-sm font-medium ${uploadType === 'file' ? 'border-b-2 border-[#a89984] text-white' : 'text-gray-400'}`}>
                    Upload File
                </button>
                <button type="button" onClick={() => setUploadType('link')} className={`px-4 py-2 text-sm font-medium ${uploadType === 'link' ? 'border-b-2 border-[#a89984] text-white' : 'text-gray-400'}`}>
                    Add Link
                </button>
            </div>

            <div className="pt-4">
                {uploadType === 'file' && (
                    <div>
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                        {molecule.sdsFilename ? (
                             <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-700 rounded-md">
                                <div className="flex items-center space-x-3 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm text-gray-300 truncate">{molecule.sdsFilename}</span>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0">
                                    <button type="button" onClick={triggerFilePicker} className="text-xs font-semibold text-[#a89984] hover:underline">Replace</button>
                                    <button type="button" onClick={handleRemoveSds} className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                                </div>
                            </div>
                        ) : (
                            <div onClick={triggerFilePicker} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-[#a89984] transition-colors">
                                <div className="space-y-1 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <div className="flex text-sm text-gray-400 justify-center">
                                        <span>Upload a file</span>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, DOCX, XLSX, PNG, JPG</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {uploadType === 'link' && (
                     <div className="space-y-2">
                        <input 
                            type="url" 
                            value={molecule.sdsUrl || ''} 
                            onChange={handleUrlChange}
                            onBlur={handleUrlBlur}
                            placeholder="Enter URL to SDS/MSDS" 
                            className="w-full bg-[#111] border border-gray-700 rounded px-4 py-2 text-sm" 
                        />
                         {molecule.sdsUrl && (
                             <button type="button" onClick={handleRemoveSds} className="text-xs font-semibold text-red-500 hover:underline">Remove Link</button>
                         )}
                    </div>
                )}
            </div>
        </div>
    </div>
    )
};

const InventoryFields = ({ molecule, handleBatchChange, addBatch, removeBatch, currencySymbol }: { molecule: Molecule, handleBatchChange: any, addBatch: any, removeBatch: any, currencySymbol: string }) => (
     <div>
        <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-4">
            <h3 className="text-lg font-medium leading-6 text-white">Inventory Batches</h3>
             <button type="button" onClick={addBatch} className="bg-[#a89984] hover:bg-opacity-90 text-black text-xs font-bold py-1.5 px-3 rounded">
                + Add Batch
            </button>
        </div>
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {molecule.inventoryBatches.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                    <p className="text-gray-500 text-sm">No inventory batches recorded.</p>
                    <p className="text-gray-600 text-xs mt-1">Add a batch to track stock and costs.</p>
                </div>
            )}

            {molecule.inventoryBatches.map((batch, index) => (
                <div key={index} className="bg-[#111] rounded-lg border border-gray-700 overflow-hidden">
                    {/* Batch Header */}
                    <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Batch #{index + 1}</span>
                         <button type="button" onClick={() => removeBatch(index)} className="text-red-500 hover:text-red-400 text-xs font-bold">
                            Remove
                        </button>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Column 1: Supplier Info */}
                        <div className="space-y-3">
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Lab / Manufacturer</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. IFF, Givaudan" 
                                    value={batch.lab} 
                                    onChange={e => handleBatchChange(index, 'lab', e.target.value)} 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[#a89984] focus:outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Supplier / Vendor</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Perfumer's Apprentice" 
                                    value={batch.supplier} 
                                    onChange={e => handleBatchChange(index, 'supplier', e.target.value)} 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[#a89984] focus:outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Batch Number</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. A-12345" 
                                    value={batch.batchNumber} 
                                    onChange={e => handleBatchChange(index, 'batchNumber', e.target.value)} 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[#a89984] focus:outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Purchase Date</label>
                                <input 
                                    type="date" 
                                    value={batch.purchaseDate} 
                                    onChange={e => handleBatchChange(index, 'purchaseDate', e.target.value)} 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-[#a89984] focus:outline-none" 
                                />
                            </div>
                        </div>

                        {/* Column 2: Stock & Cost */}
                        <div className="space-y-3">
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Current Stock (g)</label>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={batch.stockAmount} 
                                    onChange={e => handleBatchChange(index, 'stockAmount', parseFloat(e.target.value))} 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-white font-mono focus:border-[#a89984] focus:outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Cost per Gram ({currencySymbol})</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">{currencySymbol}</span>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        step="0.01" 
                                        value={batch.costPerGram} 
                                        onChange={e => handleBatchChange(index, 'costPerGram', parseFloat(e.target.value))} 
                                        className="w-full bg-[#0a0a0a] border border-gray-700 rounded pl-8 pr-3 py-2 text-sm text-white font-mono focus:border-[#a89984] focus:outline-none" 
                                    />
                                </div>
                            </div>
                            <div className="pt-4 text-right">
                                <span className="text-xs text-gray-500">Total Value: </span>
                                <span className="text-sm font-mono text-[#a89984] font-bold">
                                    {currencySymbol}{(batch.stockAmount * batch.costPerGram).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const ScentDNAFields = ({ molecule, setMolecule }: { molecule: Molecule, setMolecule: React.Dispatch<React.SetStateAction<Molecule>> }) => {
    const [newFacet, setNewFacet] = useState('');

     const handleScentDNAValueChange = (facet: string, value: number) => {
        setMolecule(prev => ({
            ...prev,
            scentDNA: {
                ...prev.scentDNA,
                [facet]: value,
            }
        }))
    };
    
    const handleAddScentDNAFacet = () => {
        if (newFacet && !molecule.scentDNA.hasOwnProperty(newFacet) && Object.keys(molecule.scentDNA).length < 6) {
             setMolecule(prev => ({
                ...prev,
                scentDNA: {
                    ...prev.scentDNA,
                    [newFacet]: 3, // Default value
                }
            }));
            setNewFacet('');
        }
    };

    const handleRemoveScentDNAFacet = (facetToRemove: string) => {
        if (Object.keys(molecule.scentDNA).length > 3) {
            const newScentDNA = { ...molecule.scentDNA };
            delete newScentDNA[facetToRemove];
            setMolecule(prev => ({
                ...prev,
                scentDNA: newScentDNA,
            }));
        }
    };

    const availableFacets = useMemo(() => {
        return SCENT_FACETS.filter(f => !molecule.scentDNA.hasOwnProperty(f));
    }, [molecule.scentDNA]);

    return (
        <div>
            <h3 className="text-lg font-medium leading-6 text-white border-b border-gray-700 pb-2 mb-2">Scent DNA</h3>
            <p className="text-sm text-gray-500 mb-4">Select between 3 to 6 facets and rate them from 0 (not present) to 5 (dominant).</p>
            <div className="space-y-3">
                {Object.entries(molecule.scentDNA).map(([facet, value]) => (
                    <div key={facet} className="flex items-center space-x-3">
                        <label className="w-28 text-sm text-gray-300 truncate">{facet}</label>
                        <input
                            type="range"
                            min="0" max="5"
                            value={value}
                            onChange={(e) => handleScentDNAValueChange(facet, parseInt(e.target.value))}
                            className="flex-grow h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="w-8 text-center text-sm font-mono bg-[#111] py-1 rounded-md">{value}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveScentDNAFacet(facet)}
                            disabled={Object.keys(molecule.scentDNA).length <= 3}
                            className="text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed text-xl font-bold"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            {Object.keys(molecule.scentDNA).length < 6 && (
                <div className="mt-4 flex items-center space-x-2">
                    <select
                        value={newFacet}
                        onChange={(e) => setNewFacet(e.target.value)}
                        className="flex-grow bg-[#111] border-gray-700 rounded-md shadow-sm focus:ring-[#a89984] focus:border-[#a89984] sm:text-sm px-4 py-2"
                    >
                        <option value="">Add a facet...</option>
                        {availableFacets.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <button type="button" onClick={handleAddScentDNAFacet} className="text-sm text-[#a89984] hover:text-opacity-80 font-semibold p-2 rounded-md bg-gray-700 hover:bg-gray-600">
                        Add
                    </button>
                </div>
            )}
        </div>
    );
};

const EvaporationCurveFields = ({ molecule, setMolecule }: { molecule: Molecule, setMolecule: React.Dispatch<React.SetStateAction<Molecule>> }) => {
    const handlePointChange = (index: number, value: number) => {
        const newCurve = [...molecule.evaporationCurve];
        newCurve[index] = Math.max(0, Math.min(100, value));
        setMolecule(prev => ({ ...prev, evaporationCurve: newCurve }));
    };

    const addPoint = () => {
        const newCurve = [...molecule.evaporationCurve, 50];
        setMolecule(prev => ({ ...prev, evaporationCurve: newCurve }));
    };

    const removePoint = () => {
        if (molecule.evaporationCurve.length > 1) {
            const newCurve = molecule.evaporationCurve.slice(0, -1);
            setMolecule(prev => ({ ...prev, evaporationCurve: newCurve }));
        }
    };

    return (
        <div>
            <h3 className="text-lg font-medium leading-6 text-white border-b border-gray-700 pb-2 mb-4">Evaporation Curve</h3>
            <p className="text-sm text-gray-500 mb-4">Adjust the scent strength over time (0-100).</p>
            <div className="space-y-4 pr-2">
                {molecule.evaporationCurve.map((point, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <label className="w-16 text-sm text-gray-300">T{index}</label>
                        <input
                            type="range"
                            min="0" max="100"
                            value={point}
                            onChange={(e) => handlePointChange(index, parseInt(e.target.value))}
                            className="flex-grow h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="number"
                            min="0" max="100"
                            value={point}
                            onChange={(e) => handlePointChange(index, parseInt(e.target.value))}
                            className="w-20 text-center text-sm font-mono bg-[#111] py-1 px-2 rounded-md border border-gray-600"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4 flex space-x-4">
                <button type="button" onClick={addPoint} className="text-sm text-[#a89984] hover:text-opacity-80 font-semibold">
                    + Add Point
                </button>
                <button type="button" onClick={removePoint} className="text-sm text-red-500 hover:text-red-400 font-semibold" disabled={molecule.evaporationCurve.length <= 1}>
                    - Remove Last Point
                </button>
            </div>
        </div>
    );
};


const AddMoleculeModal: React.FC<AddMoleculeModalProps> = ({ moleculeToEdit, onSave, onClose, mode = 'add', initialData = null, currencySymbol, onScanTDS }) => {
    const [molecule, setMolecule] = useState<Molecule>(() => {
        const base = moleculeToEdit 
            ? JSON.parse(JSON.stringify(moleculeToEdit))
            : { ...emptyMolecule, id: `user-${Date.now()}`, createdAt: new Date().toISOString() };
        
        // If there's initial data (from TDS extraction), merge it
        if (initialData) {
            return { ...base, ...initialData };
        }
        return base;
    });

    useEffect(() => {
        if (initialData && !moleculeToEdit) {
            setMolecule(prev => ({ ...prev, ...initialData, id: prev.id, createdAt: prev.createdAt }));
        }
    }, [initialData, moleculeToEdit]);

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMolecule(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMolecule(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }

    const handleBatchChange = (index: number, field: keyof InventoryBatch, value: string | number) => {
        const newBatches = [...molecule.inventoryBatches];
        newBatches[index] = { ...newBatches[index], [field]: value };
        setMolecule(prev => ({ ...prev, inventoryBatches: newBatches }));
    };

    const addBatch = () => {
        const newBatch: InventoryBatch = {
            id: `batch-${Date.now()}`,
            batchNumber: '',
            lab: '',
            supplier: '',
            purchaseDate: new Date().toISOString().split('T')[0],
            stockAmount: 0,
            costPerGram: 0
        };
        setMolecule(prev => ({ ...prev, inventoryBatches: [...prev.inventoryBatches, newBatch] }));
    };
    
    const removeBatch = (index: number) => {
      const newBatches = molecule.inventoryBatches.filter((_, i) => i !== index);
      setMolecule(prev => ({ ...prev, inventoryBatches: newBatches}));
    }

    const handleFunctionalRoleChange = (role: FunctionalRole) => {
        setMolecule(prev => {
            const currentRoles = prev.functionalRole || [];
            const newRoles = currentRoles.includes(role)
                ? currentRoles.filter(r => r !== role)
                : [...currentRoles, role];
            return { ...prev, functionalRole: newRoles };
        });
    };
    
    const handleRoleChange = (role: string) => {
        setMolecule(prev => {
            const currentRoles = prev.roles || [];
            const newRoles = currentRoles.includes(role)
                ? currentRoles.filter(r => r !== role)
                : [...currentRoles, role];
            return { ...prev, roles: newRoles };
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(molecule);
    };

    const getTitleAndContent = () => {
        switch (mode) {
            case 'edit-header':
                return { title: `Edit Basic Info: ${moleculeToEdit?.name}`, content: <HeaderFields molecule={molecule} handleChange={handleChange} handleRoleChange={handleRoleChange} /> };
            case 'edit-metrics':
                return { title: `Edit Key Metrics: ${moleculeToEdit?.name}`, content: <MetricsFields molecule={molecule} handleNumberChange={handleNumberChange} /> };
            case 'edit-functional-role':
                 return { title: `Edit Functional Role: ${moleculeToEdit?.name}`, content: <FunctionalRoleFields molecule={molecule} handleFunctionalRoleChange={handleFunctionalRoleChange} /> };
            case 'edit-tech-data':
                return { title: `Edit Technical Data: ${moleculeToEdit?.name}`, content: <TechDataFields molecule={molecule} setMolecule={setMolecule} handleChange={handleChange} handleNumberChange={handleNumberChange} /> };
            case 'edit-inventory':
                return { title: `Edit Inventory: ${moleculeToEdit?.name}`, content: <InventoryFields molecule={molecule} handleBatchChange={handleBatchChange} addBatch={addBatch} removeBatch={removeBatch} currencySymbol={currencySymbol} /> };
            case 'edit-scent-dna':
                return { title: `Edit Scent DNA: ${moleculeToEdit?.name}`, content: <ScentDNAFields molecule={molecule} setMolecule={setMolecule} /> };
            case 'edit-evaporation-curve':
                return { title: `Edit Evaporation Curve: ${moleculeToEdit?.name}`, content: <EvaporationCurveFields molecule={molecule} setMolecule={setMolecule} /> };
            case 'add':
            default:
                return {
                    title: moleculeToEdit ? 'Edit Molecule' : 'Add New Molecule',
                    content: (
                        <div className="space-y-6">
                            {onScanTDS && !moleculeToEdit && (
                                <div className="bg-gray-50 dark:bg-[#111] border border-[#a89984] rounded-md p-4 mb-6 flex items-center justify-between shadow-sm">
                                    <div>
                                        <h4 className="font-bold text-[#a89984] text-sm">Have a Technical Data Sheet?</h4>
                                        <p className="text-gray-500 text-xs">Let AI extract the data for you.</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={onScanTDS}
                                        className="bg-[#a89984] text-black font-bold py-2 px-4 rounded hover:bg-opacity-90 text-sm flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Auto-fill from TDS
                                    </button>
                                </div>
                            )}
                            <HeaderFields molecule={molecule} handleChange={handleChange} handleRoleChange={handleRoleChange} />
                            <FunctionalRoleFields molecule={molecule} handleFunctionalRoleChange={handleFunctionalRoleChange} />
                            <ScentDNAFields molecule={molecule} setMolecule={setMolecule} />
                            <EvaporationCurveFields molecule={molecule} setMolecule={setMolecule} />
                            <InventoryFields molecule={molecule} handleBatchChange={handleBatchChange} addBatch={addBatch} removeBatch={removeBatch} currencySymbol={currencySymbol} />
                            <MetricsFields molecule={molecule} handleNumberChange={handleNumberChange} />
                            <TechDataFields molecule={molecule} setMolecule={setMolecule} handleChange={handleChange} handleNumberChange={handleNumberChange} />
                        </div>
                    )
                };
        }
    };

    const { title, content } = getTitleAndContent();

    return (
        <BaseModal title={title} onClose={onClose} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {content}

                <div className="pt-5">
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" className="bg-[#a89984] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-opacity-80">
                            Save Molecule
                        </button>
                    </div>
                </div>
            </form>
        </BaseModal>
    );
};

export default AddMoleculeModal;
