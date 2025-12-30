
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { OlfactiveFamily, Molecule, Formula, ScentNote, WishlistItem, ActivityEvent, OlfactiveFamilyProfile, FinishedProduct } from './types';
import { MOCK_CORE_MOLECULES, MOCK_USER_FORMULAS, MOCK_USER_MOLECULES, MOCK_USER_NOTES, MOCK_WISHLIST, OLFACTIVE_FAMILY_PROFILES, MOCK_FINISHED_PRODUCTS } from './constants';
import Sidebar from './components/Sidebar';
import MoleculeDetail from './components/MoleculeDetail';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';


// Lazy load views
const FormularyView = lazy(() => import('./components/views/FormularyView'));
const InventoryHubView = lazy(() => import('./components/views/InventoryHubView'));
const LibraryView = lazy(() => import('./components/views/LibraryView'));
const TrainingGymView = lazy(() => import('./components/views/TrainingGymView'));
const RelationshipExplorerView = lazy(() => import('./components/views/RelationshipExplorerView'));
const AboutUsView = lazy(() => import('./components/views/AboutUsView'));
const MoleculeLibrarySidebar = lazy(() => import('./components/sidebars/MoleculeLibrarySidebar'));
const OlfactoryMapView = lazy(() => import('./components/views/OlfactoryMapView'));
const ProductStudioView = lazy(() => import('./components/views/ProductStudioView'));

const AddMoleculeModal = lazy(() => import('./components/modals/AddMoleculeModal'));
const FormulaDNAModal = lazy(() => import('./components/modals/FormulaDNAModal'));
const AllActivityModal = lazy(() => import('./components/modals/AllActivityModal'));
const ConfirmDeleteModal = lazy(() => import('./components/modals/ConfirmDeleteModal'));
const EditFamilyProfileModal = lazy(() => import('./components/modals/EditFamilyProfileModal'));
const SettingsModal = lazy(() => import('./components/modals/SettingsModal'));
const AddFromTDSModal = lazy(() => import('./components/modals/AddFromTDSModal'));

type ModalType =
    | 'add-molecule'
    | 'formula-dna'
    | 'edit-molecule-header'
    | 'edit-molecule-metrics'
    | 'edit-molecule-functional-role'
    | 'edit-molecule-tech-data'
    | 'edit-molecule-inventory'
    | 'edit-molecule-scent-dna'
    | 'edit-molecule-evaporation-curve'
    | 'edit-molecule-full'
    | 'settings'
    | 'scan-tds'
    | null;

export type ViewType = 'dashboard' | 'library' | 'formulary' | 'product-studio' | 'inventory' | 'training-gym' | 'scent-bank' | 'relationship-explorer' | 'about-us';

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', BRL: 'R$', JPY: '¥',
    CAD: 'C$', AUD: 'A$', CHF: 'Fr.', CNY: '¥', INR: '₹', AED: 'dh'
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    // App State
    const [molecules, setMolecules] = useState<Molecule[]>([]);
    const [formulas, setFormulas] = useState<Formula[]>([]);
    const [notes, setNotes] = useState<ScentNote[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [finishedProducts, setFinishedProducts] = useState<FinishedProduct[]>([]);
    const [olfactiveFamilyProfiles, setOlfactiveFamilyProfiles] = useState<Record<OlfactiveFamily, OlfactiveFamilyProfile>>({} as Record<OlfactiveFamily, OlfactiveFamilyProfile>);

    const [currency, setCurrency] = useState<string>('USD');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const [activeMoleculeId, setActiveMoleculeId] = useState<string | null>(null);
    const [activeFormulaId, setActiveFormulaId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [openModal, setOpenModal] = useState<ModalType>(null);
    const [isAllActivityModalOpen, setIsAllActivityModalOpen] = useState(false);
    const [moleculeToEdit, setMoleculeToEdit] = useState<Molecule | null>(null);
    const [moleculeToDelete, setMoleculeToDelete] = useState<Molecule | null>(null);
    const [formulaToDelete, setFormulaToDelete] = useState<Formula | null>(null);
    const [productToDelete, setProductToDelete] = useState<FinishedProduct | null>(null);
    const [profileToEdit, setProfileToEdit] = useState<{ family: OlfactiveFamily; profile: OlfactiveFamilyProfile } | null>(null);
    const [formulaForDNA, setFormulaForDNA] = useState<Formula | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [moleculeToAdd, setMoleculeToAdd] = useState<Molecule | null>(null);
    const [initialMoleculeData, setInitialMoleculeData] = useState<Partial<Molecule> | null>(null);

    const currencySymbol = useMemo(() => CURRENCY_SYMBOLS[currency], [currency]);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // useEffect(() => {
    //     setIsLoading(true);
    //     const timer = setTimeout(() => {
    //         setMolecules([...MOCK_CORE_MOLECULES, ...MOCK_USER_MOLECULES]);
    //         setFormulas(MOCK_USER_FORMULAS);
    //         setNotes(MOCK_USER_NOTES);
    //         setWishlist(MOCK_WISHLIST);
    //         setFinishedProducts(MOCK_FINISHED_PRODUCTS);
    //         setOlfactiveFamilyProfiles(OLFACTIVE_FAMILY_PROFILES);
    //         setIsLoading(false);
    //     }, 1500);
    //     return () => clearTimeout(timer);
    // }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);

            // 🔹 Molecules with Batches
            const { data: moleculesData, error: moleculesError } = await supabase
                .from('molecules')
                .select('*, molecule_batches(*)')
                .order('name');

            if (moleculesError) {
                console.error('Erro ao buscar moléculas:', moleculesError);
            } else {
                // Map snake_case DB data to camelCase interface
                const mappedMolecules: Molecule[] = (moleculesData || []).map((m: any) => ({
                    id: m.id.toString(),
                    name: m.name,
                    olfactiveFamily: m.olfactive_family,
                    origin: m.material_origin,
                    physicalState: m.physical_state,
                    roles: m.note_roles || [],
                    functionalRole: m.functional_roles || [],
                    casNumber: m.cas_number,
                    iupacName: m.iupac_name,
                    odorStrength: 5, // Default or fetch if exists (DB table schema doesn't show it explicitly, assuming default or check other columns)
                    impact: m.impact || 0,
                    scentDNA: m.scent_dna || {},
                    evaporationCurve: m.evaporation_curve || [],
                    synergies: [], // Not in DB schema provided
                    IFRA_MAX_CONCENTRATION: m.ifra_max_percent,
                    sdsUrl: m.sds_file_url,
                    createdAt: m.created_at,
                    inventoryBatches: (m.molecule_batches || []).map((b: any) => ({
                        id: b.id.toString(),
                        batchNumber: b.batch_number,
                        lab: b.lab_manufacturer,
                        supplier: b.supplier_vendor,
                        purchaseDate: b.purchase_date,
                        stockAmount: b.current_stock_grams,
                        costPerGram: b.cost_per_gram
                    }))
                }));
                setMolecules(mappedMolecules);
            }

            // 🔹 Notes
            const { data: notesData, error: notesError } = await supabase
                .from('scent_notes')
                .select('*');

            if (notesError) {
                console.warn('Erro ao buscar notas (tabela pode não existir ainda):', notesError.message);
                setNotes([]); // Ou MOCK_USER_NOTES se preferir fallback
            } else {
                const mappedNotes: ScentNote[] = (notesData || []).map((n: any) => ({
                    id: n.id.toString(),
                    moleculeId: n.molecule_id.toString(),
                    text: n.text,
                    createdAt: n.created_at
                }));
                setNotes(mappedNotes);
            }

            // 🔹 Wishlist
            const { data: wishlistData, error: wishlistError } = await supabase
                .from('wishlist_items')
                .select('*');

            if (wishlistError) {
                console.warn('Erro ao buscar wishlist (tabela pode não existir ainda):', wishlistError.message);
                setWishlist([]);
            } else {
                const mappedWishlist: WishlistItem[] = (wishlistData || []).map((w: any) => ({
                    id: w.id.toString(),
                    name: w.name,
                    note: w.note
                }));
                setWishlist(mappedWishlist);
            }

            // 🔹 Supabase for Family Profiles? (If static, keep constant, but if dynamic...)
            // For now, keep constant as they define the system's logic mostly
            setOlfactiveFamilyProfiles(OLFACTIVE_FAMILY_PROFILES);

            // 🔹 Formulas & Products (Future migration)
            setFormulas(MOCK_USER_FORMULAS);
            setFinishedProducts(MOCK_FINISHED_PRODUCTS);


            setIsLoading(false);
        };

        fetchInitialData();
    }, []);


    const allMolecules = useMemo(() => {
        return molecules.map(m => {
            //   const totalStock = m.inventoryBatches.reduce((sum, batch) => sum + batch.stockAmount, 0);
            //   const totalValue = m.inventoryBatches.reduce((sum, batch) => sum + batch.stockAmount * batch.costPerGram, 0);
            const batches = m.inventoryBatches ?? [];

            const totalStock = batches.reduce(
                (sum, batch) => sum + (batch.stockAmount ?? 0),
                0
            );

            const totalValue = batches.reduce(
                (sum, batch) => sum + (batch.stockAmount ?? 0) * (batch.costPerGram ?? 0),
                0
            );
            return { ...m, totalStock, avgCostPerGram: totalStock > 0 ? totalValue / totalStock : 0 };
        });
    }, [molecules]);

    const activityFeed = useMemo(() => {
        const moleculeEvents: ActivityEvent[] = molecules.map(m => ({ type: 'molecule', data: m, date: new Date(m.createdAt) }));
        const formulaEvents: ActivityEvent[] = formulas.map(f => ({ type: 'formula', data: f, date: new Date(f.createdAt) }));
        const noteEvents: ActivityEvent[] = notes.map(n => ({ type: 'note', data: n, date: new Date(n.createdAt) }));
        return [...moleculeEvents, ...formulaEvents, ...noteEvents].sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [molecules, formulas, notes]);

    const recentActivityFeed = useMemo(() => activityFeed.slice(0, 5), [activityFeed]);
    const activeMolecule = useMemo(() => allMolecules.find(m => m.id === activeMoleculeId) || null, [activeMoleculeId, allMolecules]);
    const activeNotes = useMemo(() => notes.filter(n => n.moleculeId === activeMoleculeId), [notes, activeMoleculeId]);

    const handleSetView = useCallback((view: ViewType) => { setCurrentView(view); setActiveMoleculeId(null); setIsSidebarOpen(false); }, []);
    const handleSelectMolecule = useCallback((id: string) => { setActiveMoleculeId(id); setCurrentView(prev => prev !== 'library' ? 'library' : prev); setIsSidebarOpen(false); }, []);
    const handleSelectFormula = useCallback((formulaId: string) => { setActiveFormulaId(formulaId); handleSetView('formulary'); }, [handleSetView]);

    const handleSaveMolecule = useCallback(async (molecule: Molecule) => {
        try {
            const isNew = molecule.id.startsWith('user-');

            // Map to snake_case for DB
            const dbMolecule = {
                name: molecule.name,
                olfactive_family: molecule.olfactiveFamily,
                material_origin: molecule.origin,
                physical_state: molecule.physicalState,
                note_roles: molecule.roles,
                functional_roles: molecule.functionalRole,
                cas_number: molecule.casNumber,
                iupac_name: molecule.iupacName,
                // odor_strength? Not in Schema check provided, assuming it might be 'impact' or missing? 
                // Schema had 'impact' (integer), 'tenacity_hours'? 
                // Wait, User Schema: impact integer null, tenacity_hours integer null.
                // Molecule interface: impact: number (tenacity?), odorStrength: number?
                // MOCK data: odorStrength: 7, impact: 4.
                // AddMoleculeModal matches: "Impact (1-10)" -> odorStrength property in input name? NO. 
                // MetricsFields: name="odorStrength" (Impact 1-10 label). name="impact" (Tenacity label).
                // So: odorStrength -> impact (DB), impact -> tenacity_hours (DB)?
                // Checking DB schema again: impact check impact >= 1 and impact <= 10. So DB 'impact' = TS 'odorStrength'.
                // DB 'tenacity_hours' = TS 'impact'.
                impact: molecule.odorStrength,
                tenacity_hours: molecule.impact,

                scent_dna: molecule.scentDNA,
                evaporation_curve: molecule.evaporationCurve,
                ifra_max_percent: molecule.IFRA_MAX_CONCENTRATION,
                sds_file_url: molecule.sdsUrl,
            };

            let savedMoleculeId = molecule.id;
            let savedCreatedAt = molecule.createdAt;

            if (isNew) {
                const { data, error } = await supabase.from('molecules').insert(dbMolecule).select().single();
                if (error) throw error;
                savedMoleculeId = data.id.toString();
                savedCreatedAt = data.created_at;
            } else {
                const { error } = await supabase.from('molecules').update(dbMolecule).eq('id', molecule.id);
                if (error) throw error;
            }

            // Handle Batches
            if (molecule.inventoryBatches && molecule.inventoryBatches.length > 0) {
                for (const batch of molecule.inventoryBatches) {
                    const batchData = {
                        molecule_id: parseInt(savedMoleculeId),
                        batch_number: batch.batchNumber,
                        lab_manufacturer: batch.lab,
                        supplier_vendor: batch.supplier,
                        purchase_date: batch.purchaseDate,
                        current_stock_grams: batch.stockAmount,
                        cost_per_gram: batch.costPerGram
                    };

                    if (batch.id.startsWith('batch-')) {
                        await supabase.from('molecule_batches').insert(batchData);
                    } else {
                        await supabase.from('molecule_batches').update(batchData).eq('id', batch.id);
                    }
                }
            }

            // Update Local State with real ID
            setMolecules(prev => {
                if (isNew) {
                    // Replace the temp ID with real ID
                    return [...prev, { ...molecule, id: savedMoleculeId, createdAt: savedCreatedAt }];
                } else {
                    return prev.map(m => m.id === molecule.id ? { ...molecule } : m);
                }
            });

            setOpenModal(null); setMoleculeToEdit(null); setInitialMoleculeData(null);

        } catch (error: any) {
            console.error("Error saving molecule:", error);
            // alert("Failed to save: " + error.message); // Optional: add toast later
        }
    }, []);

    const handleRequestDelete = useCallback((molecule: Molecule) => setMoleculeToDelete(molecule), []);
    const handleDeleteMolecule = useCallback((id: string) => { setMolecules(prev => prev.filter(m => m.id !== id)); setActiveMoleculeId(prevId => prevId === id ? null : prevId); setMoleculeToDelete(null); }, []);
    const handleSaveFormula = useCallback((formula: Formula) => { setFormulas(prev => { const exists = prev.some(f => f.id === formula.id); return exists ? prev.map(f => f.id === formula.id ? formula : f) : [...prev, formula]; }); }, []);
    const handleRequestDeleteFormula = useCallback((formula: Formula) => setFormulaToDelete(formula), []);
    const handleDeleteFormula = useCallback(() => { if (formulaToDelete) { setFormulas(prev => prev.filter(f => f.id !== formulaToDelete.id)); if (activeFormulaId === formulaToDelete.id) setActiveFormulaId(null); setFormulaToDelete(null); } }, [formulaToDelete, activeFormulaId]);
    const handleSaveProduct = useCallback((product: FinishedProduct) => { setFinishedProducts(prev => { const exists = prev.some(p => p.id === product.id); return exists ? prev.map(p => p.id === product.id ? product : p) : [...prev, product]; }); }, []);
    const handleRequestDeleteProduct = useCallback((product: FinishedProduct) => setProductToDelete(product), []);
    const handleDeleteProduct = useCallback(() => { if (productToDelete) { setFinishedProducts(prev => prev.filter(p => p.id !== productToDelete.id)); setProductToDelete(null); } }, [productToDelete]);
    const handleOpenMoleculeEditor = useCallback((molecule: Molecule, mode: string) => { setMoleculeToEdit(molecule); setOpenModal(`edit-molecule-${mode}` as ModalType); }, []);
    const handleOpenAddMolecule = useCallback((initialData: Partial<Molecule> | null = null) => { setMoleculeToEdit(null); setInitialMoleculeData(initialData); setOpenModal('add-molecule'); }, []);
    const handleOpenFormulaDNA = useCallback((formula: Formula) => { setFormulaForDNA(formula); setOpenModal('formula-dna'); }, []);
    const handleAddToFormula = useCallback((molecule: Molecule) => { setMoleculeToAdd(molecule); handleSetView('formulary'); }, [handleSetView]);
    const handleClearMoleculeToAdd = useCallback(() => setMoleculeToAdd(null), []);
    const handleAddWishlistItem = useCallback((item: Omit<WishlistItem, 'id'>) => { if (item.name.trim() === '') return; setWishlist(prev => [{ ...item, id: `wish-${Date.now()}` }, ...prev]); }, []);
    const handleRemoveWishlistItem = useCallback((id: string) => { setWishlist(prev => prev.filter(item => item.id !== id)); }, []);
    const handleOpenEditFamilyProfile = useCallback((family: OlfactiveFamily) => { const profile = olfactiveFamilyProfiles[family]; if (profile) setProfileToEdit({ family, profile }); }, [olfactiveFamilyProfiles]);
    const handleSaveFamilyProfile = useCallback((family: OlfactiveFamily, newProfile: OlfactiveFamilyProfile) => { setOlfactiveFamilyProfiles(prev => ({ ...prev, [family]: newProfile })); setProfileToEdit(null); }, []);
    const handleSaveNote = useCallback((note: ScentNote) => { setNotes(prev => { const exists = prev.some(n => n.id === note.id); return exists ? prev.map(n => n.id === note.id ? note : n) : [note, ...prev]; }); }, []);
    const handleDeleteNote = useCallback((noteId: string) => { setNotes(prev => prev.filter(n => n.id !== noteId)); }, []);
    const handleCloseModal = useCallback(() => { setOpenModal(null); setInitialMoleculeData(null); setIsAllActivityModalOpen(false); }, []);
    const handleSelectMoleculeFromActivity = useCallback((id: string) => { handleSelectMolecule(id); setIsAllActivityModalOpen(false); }, [handleSelectMolecule]);
    const handleSelectFormulaFromActivity = useCallback((id: string) => { handleSelectFormula(id); setIsAllActivityModalOpen(false); }, [handleSelectFormula]);

    const handleOpenSettings = useCallback(() => setOpenModal('settings'), []);
    const handleClearAllData = useCallback(() => { setMolecules([]); setFormulas([]); setFinishedProducts([]); setNotes([]); setWishlist([]); }, []);

    const handleExportBackup = useCallback(() => {
        const data = { version: 1, date: new Date().toISOString(), molecules, formulas, finishedProducts, notes, wishlist, olfactiveFamilyProfiles };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `MoleculeX_Backup.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }, [molecules, formulas, finishedProducts, notes, wishlist, olfactiveFamilyProfiles]);
    const handleImportBackup = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try { const data = JSON.parse(e.target?.result as string); if (data.molecules) setMolecules(data.molecules); if (data.formulas) setFormulas(data.formulas); if (data.finishedProducts) setFinishedProducts(data.finishedProducts); alert('Restored!'); } catch (err) { alert('Invalid file'); }
        };
        reader.readAsText(file);
    }, []);

    // TDS Feature
    const handleOpenScanTDS = useCallback(() => {
        setOpenModal('scan-tds');
    }, []);

    const handleTDSExtractionComplete = useCallback((data: Partial<Molecule>) => {
        setInitialMoleculeData(data);
        setOpenModal('add-molecule');
    }, []);

    const handleRestoreTemplates = useCallback(async () => {
        const moleculesToSeed = [...MOCK_CORE_MOLECULES, ...MOCK_USER_MOLECULES];

        const results = [];
        let successCount = 0;
        let failCount = 0;

        console.log(`Starting seeding of ${moleculesToSeed.length} molecules...`);

        for (const molecule of moleculesToSeed) {
            try {
                // Check dupes by CAS or Name
                let exists = false;
                if (molecule.casNumber) {
                    const { data } = await supabase.from('molecules').select('id').eq('cas_number', molecule.casNumber).maybeSingle();
                    if (data) exists = true;
                } else {
                    const { data } = await supabase.from('molecules').select('id').eq('name', molecule.name).maybeSingle();
                    if (data) exists = true;
                }

                if (exists) {
                    console.log(`Skipping ${molecule.name} (already exists)`);
                    continue;
                }

                // Prepare DB Object
                const dbMolecule = {
                    name: molecule.name,
                    olfactive_family: molecule.olfactiveFamily,
                    material_origin: molecule.origin,
                    physical_state: molecule.physicalState,
                    note_roles: molecule.roles,
                    functional_roles: molecule.functionalRole,
                    cas_number: molecule.casNumber,
                    iupac_name: molecule.iupacName,
                    impact: molecule.odorStrength, // DB impact = TS odorStrength (1-10)
                    tenacity_hours: molecule.impact, // DB tenacity = TS impact (hours/value)
                    scent_dna: molecule.scentDNA,
                    evaporation_curve: molecule.evaporationCurve,
                    ifra_max_percent: molecule.IFRA_MAX_CONCENTRATION,
                    sds_file_url: molecule.sdsUrl,
                };

                const { data: insertedMol, error: insertError } = await supabase.from('molecules').insert(dbMolecule).select().single();

                if (insertError) {
                    console.error(`Failed to seed ${molecule.name}:`, insertError.message);
                    failCount++;
                    continue;
                }

                const savedMoleculeId = insertedMol.id;

                // Batches
                if (molecule.inventoryBatches && molecule.inventoryBatches.length > 0) {
                    const batchesToInsert = molecule.inventoryBatches.map(b => ({
                        molecule_id: savedMoleculeId,
                        batch_number: b.batchNumber,
                        lab_manufacturer: b.lab,
                        supplier_vendor: b.supplier,
                        purchase_date: b.purchaseDate,
                        current_stock_grams: b.stockAmount,
                        cost_per_gram: b.costPerGram
                    }));
                    await supabase.from('molecule_batches').insert(batchesToInsert);
                }

                successCount++;
                results.push(insertedMol);

            } catch (err: any) {
                console.error(`Error processing ${molecule.name}:`, err.message);
                failCount++;
            }
        }

        alert(`Seeding Complete!\nSuccessfully added: ${successCount}\nSkipped/Failed: ${failCount}\n\nPlease refresh the page to see the new data.`);

        // Trigger a re-fetch manually or just ask user to refresh
        window.location.reload();

    }, []);

    const renderModal = () => {
        if (!openModal) return null;
        const common = { onSave: handleSaveMolecule, onClose: handleCloseModal, currencySymbol };
        if (openModal === 'settings') return <SettingsModal onClose={handleCloseModal} onClearAll={handleClearAllData} onRestoreTemplates={handleRestoreTemplates} onExportBackup={handleExportBackup} onImportBackup={handleImportBackup} currency={currency} setCurrency={setCurrency} theme={theme} setTheme={setTheme} />;
        if (openModal === 'add-molecule' || openModal === 'edit-molecule-full') return <AddMoleculeModal mode={openModal === 'add-molecule' ? 'add' : 'add'} initialData={initialMoleculeData} moleculeToEdit={moleculeToEdit} onScanTDS={handleOpenScanTDS} {...common} />;
        if (openModal === 'formula-dna') return formulaForDNA ? <FormulaDNAModal formula={formulaForDNA} molecules={allMolecules} onClose={handleCloseModal} /> : null;
        if (openModal === 'scan-tds') return <AddFromTDSModal onExtractionComplete={handleTDSExtractionComplete} onClose={handleCloseModal} />;
        return <AddMoleculeModal mode={openModal as any} moleculeToEdit={moleculeToEdit} {...common} />;
    };

    if (isLoading) return <div className="bg-black text-white flex items-center justify-center h-screen"><div className="text-center"><h1 className="text-4xl font-bold">Molecule<span className="text-[#a89984]">X</span></h1><p>Loading...</p></div></div>;

    return (
        <div className="bg-black text-gray-200 min-h-screen font-sans dark:bg-black dark:text-gray-200 bg-gray-100 text-gray-900 transition-colors duration-300">
            <Sidebar onSetView={handleSetView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onOpenSettings={handleOpenSettings} />
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-20 z-20" onClick={() => setIsSidebarOpen(false)} />}
            {currentView === 'library' && <Suspense fallback={null}><MoleculeLibrarySidebar allMolecules={allMolecules} activeMoleculeId={activeMoleculeId} onSelectMolecule={handleSelectMolecule} onAddNewMolecule={handleOpenAddMolecule} /></Suspense>}
            <div className={`transition-all duration-300 ${currentView === 'library' ? 'md:pl-80' : ''}`}>
                <div className="max-w-screen-2xl mx-auto">
                    <main className="p-4 sm:p-6 md:p-8 relative">
                        <button
                            className={`p-2 rounded-md bg-white dark:bg-[#1C1C1C] shadow-md fixed top-4 left-4 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Suspense fallback={<div>Loading View...</div>}>{(() => {
                            switch (currentView) {
                                case 'dashboard': return <Dashboard allMolecules={allMolecules} formulas={formulas} onSelectMolecule={handleSelectMolecule} onSelectFormula={handleSelectFormula} wishlist={wishlist} onAddWishlistItem={handleAddWishlistItem} onRemoveWishlistItem={handleRemoveWishlistItem} activityFeed={recentActivityFeed} onSeeAllActivity={() => setIsAllActivityModalOpen(true)} onSetView={handleSetView} currencySymbol={currencySymbol} />;
                                case 'library': return activeMolecule ? <MoleculeDetail molecule={activeMolecule} notes={activeNotes} olfactiveFamilyProfiles={olfactiveFamilyProfiles} onOpenEditor={handleOpenMoleculeEditor} onAddToFormula={handleAddToFormula} onRequestDelete={handleRequestDelete} onOpenEditFamilyProfile={handleOpenEditFamilyProfile} onSaveNote={handleSaveNote} onDeleteNote={handleDeleteNote} onBack={() => setActiveMoleculeId(null)} currencySymbol={currencySymbol} /> : <LibraryView molecules={allMolecules} onSelectMolecule={handleSelectMolecule} currencySymbol={currencySymbol} />;
                                case 'formulary': return <FormularyView formulas={formulas} molecules={allMolecules} olfactiveFamilyProfiles={olfactiveFamilyProfiles} onSave={handleSaveFormula} onDelete={handleRequestDeleteFormula} onOpenFormulaDNA={handleOpenFormulaDNA} moleculeToAdd={moleculeToAdd} onMoleculeAdded={handleClearMoleculeToAdd} initialFormulaId={activeFormulaId} currencySymbol={currencySymbol} />;
                                case 'product-studio': return <ProductStudioView formulas={formulas} molecules={allMolecules} products={finishedProducts} onSaveProduct={handleSaveProduct} onDeleteProduct={handleRequestDeleteProduct} currencySymbol={currencySymbol} />;
                                case 'inventory': return <InventoryHubView molecules={allMolecules} currencySymbol={currencySymbol} />;
                                case 'training-gym': return <TrainingGymView molecules={allMolecules} />;
                                case 'relationship-explorer': return <RelationshipExplorerView molecules={allMolecules} />;
                                case 'about-us': return <AboutUsView onSetView={handleSetView} />;
                                default: return null;
                            }
                        })()}</Suspense>
                    </main>
                </div>
            </div>
            <Suspense fallback={null}>
                {renderModal()}
                {isAllActivityModalOpen && <AllActivityModal feed={activityFeed} allMolecules={allMolecules} onSelectMolecule={handleSelectMoleculeFromActivity} onSelectFormula={handleSelectFormulaFromActivity} onClose={handleCloseModal} />}
                {moleculeToDelete && <ConfirmDeleteModal itemName={moleculeToDelete.name} itemType="Molecule" onConfirm={() => handleDeleteMolecule(moleculeToDelete.id)} onCancel={() => setMoleculeToDelete(null)} />}
                {formulaToDelete && <ConfirmDeleteModal itemName={formulaToDelete.name} itemType="Formula" onConfirm={handleDeleteFormula} onCancel={() => setFormulaToDelete(null)} />}
                {productToDelete && <ConfirmDeleteModal itemName={productToDelete.name} itemType="Product" onConfirm={handleDeleteProduct} onCancel={() => setProductToDelete(null)} />}
                {profileToEdit && <EditFamilyProfileModal family={profileToEdit.family} profile={profileToEdit.profile} onSave={handleSaveFamilyProfile} onCancel={() => setProfileToEdit(null)} />}
            </Suspense>
        </div>
    );
};

export default App;
