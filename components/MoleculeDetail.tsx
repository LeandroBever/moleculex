import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Molecule, ScentNote, OlfactiveFamilyProfile, OlfactiveFamily, MoleculeResource } from '../types';
import ScentDNARadarChart from './charts/ScentDNARadarChart';
import EvaporationCurveLineChart from './charts/EvaporationCurveLineChart';
import { CATEGORY_HEX_COLORS } from '../constants';
import { supabase } from '../lib/supabase';

interface MoleculeDetailProps {
    molecule: Molecule;
    notes: ScentNote[];
    olfactiveFamilyProfiles: Record<OlfactiveFamily, OlfactiveFamilyProfile>;
    onOpenEditor: (molecule: Molecule, mode: string) => void;
    onAddToFormula: (molecule: Molecule) => void;
    onRequestDelete: (molecule: Molecule) => void;
    onOpenEditFamilyProfile: (family: OlfactiveFamily) => void;
    onSaveNote: (note: ScentNote) => void;
    onDeleteNote: (noteId: string) => void;
    onBack: () => void;
    currencySymbol: string;
}

const StarRating: React.FC<{ rating: number; totalStars?: number }> = React.memo(({ rating, totalStars = 10 }) => {
    const filledStars = Math.round(rating);
    return (
        <div className="flex w-full items-center justify-between">
            {[...Array(totalStars)].map((_, i) => (
                <svg key={i} className={`h-5 w-5 ${i < filledStars ? 'text-[#a89984]' : 'text-gray-300 dark:text-gray-800'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
            ))}
        </div>
    );
});

const MetricBar: React.FC<{ value: number; max: number }> = React.memo(({ value, max }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div className="bg-[#a89984] h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    );
});

const InfoCard: React.FC<{ title: string; children: React.ReactNode; onEdit?: () => void; className?: string }> = React.memo(({ title, children, onEdit, className = "" }) => (
    <div className={`bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col shadow-sm dark:shadow-none ${className}`}>
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <h3 className="text-xs font-bold text-[#a89984] uppercase tracking-wider">{title}</h3>
            {onEdit && (
                <button onClick={onEdit} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                </button>
            )}
        </div>
        <div className="flex-grow">{children}</div>
    </div>
));

const KnowledgeResourceCard: React.FC<{ resource: MoleculeResource; onDelete: (id: string) => void }> = React.memo(({ resource, onDelete }) => {
    const isPdf = resource.type === 'pdf';
    const isLink = resource.type === 'link';
    const isImage = resource.type === 'image';

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#a89984]/50 transition-colors group w-full shadow-sm dark:shadow-none">
            <div className="flex items-center space-x-4 overflow-hidden">
                <div className={`p-3 rounded-full flex-shrink-0 ${isPdf ? 'bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400' : isLink ? 'bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400' : isImage ? 'bg-purple-100 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {isPdf ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        : isLink ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            : isImage ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                </div>
                <div className="min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-200 truncate">{resource.title}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                        <span className="uppercase tracking-wide font-medium">{resource.type}</span>
                        <span>•</span>
                        <span>{resource.fileName || resource.url}</span>
                        <span>•</span>
                        <span>{new Date(resource.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#a89984] hover:text-gray-900 dark:hover:text-white font-medium px-3 py-1 rounded-md hover:bg-[#a89984]/20 transition-colors"
                    onClick={(e) => !resource.url && e.preventDefault()}
                >
                    Open
                </a>
                <button onClick={() => onDelete(resource.id)} className="text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 font-medium px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
            </div>
        </div>
    );
});

const MoleculeDetail: React.FC<MoleculeDetailProps> = ({ molecule, notes, olfactiveFamilyProfiles, onOpenEditor, onAddToFormula, onRequestDelete, onOpenEditFamilyProfile, onSaveNote, onDeleteNote, onBack, currencySymbol }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'knowledge'>('profile');
    const [newNoteText, setNewNoteText] = useState('');
    const [editingNote, setEditingNote] = useState<{ id: string; text: string } | null>(null);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [resources, setResources] = useState<MoleculeResource[]>([]);

    useEffect(() => {
        const fetchResources = async () => {
            const { data, error } = await supabase
                .from('molecule_resources')
                .select('*')
                .eq('molecule_id', molecule.id);

            if (error) {
                console.warn('Error fetching resources:', error.message);
            } else if (data) {
                const mappedResources: MoleculeResource[] = data.map((r: any) => ({
                    id: r.id.toString(),
                    moleculeId: r.molecule_id.toString(),
                    title: r.title,
                    type: r.type, // 'pdf' | 'link' | 'image' | 'text'
                    url: r.url,
                    fileName: r.file_name,
                    date: r.created_at
                }));
                setResources(mappedResources);
            }
        };
        fetchResources();
    }, [molecule.id]);

    // Add Link State
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddNewNote = useCallback(() => {
        if (newNoteText.trim() === '') return;
        const newNote: ScentNote = { id: `note-${Date.now()}`, moleculeId: molecule.id, text: newNoteText.trim(), createdAt: new Date().toISOString() };
        onSaveNote(newNote);
        setNewNoteText('');
    }, [newNoteText, molecule.id, onSaveNote]);

    const handleStartEditing = useCallback((note: ScentNote) => {
        setEditingNote({ id: note.id, text: note.text });
    }, []);

    const handleUpdateNote = useCallback(() => {
        if (!editingNote || editingNote.text.trim() === '') return;
        const noteToSave: ScentNote = { id: editingNote.id, moleculeId: molecule.id, text: editingNote.text.trim(), createdAt: notes.find(n => n.id === editingNote.id)?.createdAt || new Date().toISOString() };
        onSaveNote(noteToSave);
        setEditingNote(null);
    }, [editingNote, molecule.id, notes, onSaveNote]);

    const handleManualSave = useCallback(() => {
        setShowSaveConfirmation(true);
        setTimeout(() => setShowSaveConfirmation(false), 3000);
    }, []);

    // --- Knowledge Base Handlers ---
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Create a mock resource from the file
            const newRes: MoleculeResource = {
                id: `res-${Date.now()}`,
                moleculeId: molecule.id,
                title: file.name,
                type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'text',
                fileName: file.name,
                date: new Date().toISOString().split('T')[0],
                url: URL.createObjectURL(file) // Create a temporary URL for preview
            };
            setResources(prev => [...prev, newRes]);
            // Reset input
            e.target.value = '';
        }
    };

    const handleStartAddLink = () => {
        setNewLinkTitle('');
        setNewLinkUrl('');
        setIsAddingLink(true);
    };

    const handleCancelAddLink = () => {
        setIsAddingLink(false);
    };

    const handleSaveLink = () => {
        if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
        const newRes: MoleculeResource = {
            id: `res-${Date.now()}`,
            moleculeId: molecule.id,
            title: newLinkTitle,
            type: 'link',
            url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
            date: new Date().toISOString().split('T')[0]
        };
        setResources(prev => [...prev, newRes]);
        setIsAddingLink(false);
        setNewLinkTitle('');
        setNewLinkUrl('');
    };

    const handleDeleteResource = useCallback((id: string) => {
        setResources(prev => prev.filter(r => r.id !== id));
    }, []);

    const familyProfile = olfactiveFamilyProfiles[molecule.olfactiveFamily];

    return (
        <div className="space-y-4 animate-fade-in pt-12 relative pb-12 h-full flex flex-col !bg-gray-100 dark:!bg-black transition-colors duration-300">
            {showSaveConfirmation && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#a89984] text-black px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="font-bold">Changes Saved</span>
                </div>
            )}
            <div className="flex flex-col space-y-4 pb-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-full bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{molecule.name}</h2>
                                <button onClick={() => onOpenEditor(molecule, 'header')} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                </button>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm text-[#a89984] font-medium">{molecule.olfactiveFamily}</span>
                                <span className="text-gray-400 dark:text-gray-700">|</span>
                                {molecule.roles.map(role => (
                                    <span key={role} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{role}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={handleManualSave} className="border border-gray-300 dark:border-[#a89984] text-gray-700 dark:text-[#a89984] hover:bg-gray-100 dark:hover:bg-[#a89984]/10 font-semibold py-2 px-4 rounded-md transition-colors text-sm flex items-center justify-center space-x-2 bg-white dark:bg-transparent shadow-sm dark:shadow-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg><span>Save</span>
                        </button>
                        <button onClick={() => onAddToFormula(molecule)} className="border border-gray-300 dark:border-[#a89984] text-gray-700 dark:text-[#a89984] hover:bg-gray-100 dark:hover:bg-[#a89984]/10 font-semibold py-2 px-4 rounded-md transition-colors text-sm bg-white dark:bg-transparent shadow-sm dark:shadow-none">Add to Formula</button>
                        <button onClick={() => onRequestDelete(molecule)} className="border border-red-200 dark:border-red-900 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-2 px-4 rounded-md transition-colors text-sm bg-white dark:bg-transparent shadow-sm dark:shadow-none">Delete</button>
                    </div>
                </div>
                <div className="flex space-x-6 mt-2">
                    <button onClick={() => setActiveTab('profile')} className={`text-sm font-bold pb-3 border-b-2 transition-colors ${activeTab === 'profile' ? 'text-[#a89984] border-[#a89984]' : 'text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-gray-300'}`}>Profile & Data</button>
                    <button onClick={() => setActiveTab('knowledge')} className={`text-sm font-bold pb-3 border-b-2 transition-colors ${activeTab === 'knowledge' ? 'text-[#a89984] border-[#a89984]' : 'text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-gray-300'}`}>Knowledge Base</button>
                </div>
            </div>

            {activeTab === 'profile' ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-3 space-y-4">
                        <InfoCard title="Scent DNA" onEdit={() => onOpenEditor(molecule, 'scent-dna')}><div className="h-72"><ScentDNARadarChart scentDNA={molecule.scentDNA} /></div></InfoCard>
                        {familyProfile && <InfoCard title="Family Profile" onEdit={() => onOpenEditFamilyProfile(molecule.olfactiveFamily)}><div className="text-sm"><p className="mb-1"><strong className="text-gray-900 dark:text-gray-300">{familyProfile.mainCharacter}</strong></p><p className="text-gray-600 dark:text-gray-500 leading-relaxed text-xs">{familyProfile.description}</p></div></InfoCard>}
                        <InfoCard title="Evaporation Curve" onEdit={() => onOpenEditor(molecule, 'evaporation-curve')}><div className="h-72"><EvaporationCurveLineChart data={molecule.evaporationCurve} /></div></InfoCard>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <InfoCard title="Metrics" onEdit={() => onOpenEditor(molecule, 'metrics')}>
                            <div className="space-y-4 text-sm">
                                <div><div className="flex justify-between items-center mb-1"><span className="text-gray-500 text-xs">Impact</span><span className="font-mono text-gray-900 dark:text-white text-xs">{molecule.odorStrength}/10</span></div><StarRating rating={molecule.odorStrength} /><div className="flex justify-between text-[10px] text-gray-600 mt-1"><span>Subtle</span><span>Powerful</span></div></div>
                                <div><div className="flex justify-between items-center mb-1"><span className="text-gray-500 text-xs">Longevity</span><span className="font-mono text-gray-900 dark:text-white text-xs">{molecule.impact}h</span></div><MetricBar value={molecule.impact} max={400} /><div className="flex justify-between text-[10px] text-gray-600 mt-1"><span>Short-lived</span><span>Long-lasting</span></div></div>
                            </div>
                        </InfoCard>
                        <InfoCard title="Tech Data" onEdit={() => onOpenEditor(molecule, 'tech-data')}>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1"><span className="text-gray-500">CAS</span> <span className="font-mono text-gray-700 dark:text-gray-300">{molecule.casNumber || '-'}</span></div>
                                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1"><span className="text-gray-500">Origin</span> <span className="text-gray-700 dark:text-gray-300">{molecule.origin || '-'}</span></div>
                                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1"><span className="text-gray-500">State</span> <span className="text-gray-700 dark:text-gray-300">{molecule.physicalState || 'Liquid'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">IFRA</span> <span className="font-mono text-[#a89984]">{molecule.IFRA_MAX_CONCENTRATION}%</span></div>
                            </div>
                        </InfoCard>
                        {molecule.functionalRole && molecule.functionalRole.length > 0 && <InfoCard title="Functions" onEdit={() => onOpenEditor(molecule, 'functional-role')}><div className="flex flex-wrap gap-2">{molecule.functionalRole.map(role => <span key={role} className="text-[10px] bg-gray-100 text-gray-600 dark:bg-[#2A2A2A] dark:text-gray-400 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded uppercase tracking-wide">{role}</span>)}</div></InfoCard>}
                        <InfoCard title="Stock & Cost" onEdit={() => onOpenEditor(molecule, 'inventory')}><div className="flex justify-between items-end"><div><p className="text-gray-500 text-xs">Current Stock</p><p className="text-xl font-mono text-gray-900 dark:text-white">{molecule.totalStock?.toFixed(2)}<span className="text-sm text-gray-500">g</span></p></div><div className="text-right"><p className="text-gray-500 text-xs">Avg Cost</p><p className="text-xl font-mono text-[#a89984]">{currencySymbol}{molecule.avgCostPerGram?.toFixed(2)}<span className="text-sm text-gray-500">/g</span></p></div></div></InfoCard>
                        <InfoCard title="Perfumer's Diary">
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 mb-2 custom-scrollbar">
                                {notes.length > 0 ? notes.map(note => (
                                    <div key={note.id} className="text-xs border-l-2 border-gray-300 dark:border-gray-700 pl-2 py-1 group relative">
                                        {editingNote?.id === note.id ? (
                                            <div className="flex gap-1"><input value={editingNote.text} onChange={e => setEditingNote({ ...editingNote, text: e.target.value })} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-1 w-full text-gray-900 dark:text-white" autoFocus /><button onClick={handleUpdateNote} className="text-green-500">✓</button></div>
                                        ) : (
                                            <><p className="text-gray-700 dark:text-gray-300">{note.text}</p><p className="text-[10px] text-gray-500 dark:text-gray-600">{new Date(note.createdAt).toLocaleDateString()}</p><div className="absolute top-0 right-0 hidden group-hover:flex bg-white dark:bg-[#1C1C1C]"><button onClick={() => handleStartEditing(note)} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white px-1">✎</button><button onClick={() => onDeleteNote(note.id)} className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500 px-1">×</button></div></>
                                        )}
                                    </div>
                                )) : <p className="text-xs text-gray-500 italic">No notes yet.</p>}
                            </div>
                            <div className="flex gap-2"><input value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="Add note..." className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1 text-xs text-gray-900 dark:text-white focus:border-[#a89984] focus:outline-none" /><button onClick={handleAddNewNote} disabled={!newNoteText} className="text-xs bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-2 rounded text-gray-600 dark:text-gray-300 disabled:opacity-50">+</button></div>
                        </InfoCard>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                    <div onClick={handleUploadClick} className="border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-8 text-center bg-gray-50 dark:bg-[#111]/50 hover:bg-white dark:hover:bg-[#111] hover:border-gray-400 dark:hover:border-gray-600 transition-all cursor-pointer group"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-700 group-hover:text-[#a89984] transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg><p className="text-gray-600 dark:text-gray-500 text-sm font-medium group-hover:text-gray-800 dark:group-hover:text-gray-300">Drop files to upload</p><p className="text-xs text-gray-500 dark:text-gray-600 mt-1">PDFs, Images, Docs</p></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isAddingLink && (
                            <div className="p-3 bg-white dark:bg-[#111] border border-[#a89984] rounded-lg flex flex-col space-y-2 animate-fade-in shadow-sm">
                                <input type="text" placeholder="Link Title" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white focus:border-[#a89984] outline-none" autoFocus />
                                <input type="text" placeholder="URL (https://...)" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-600 dark:text-gray-300 focus:border-[#a89984] outline-none" />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={handleCancelAddLink} className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                                    <button onClick={handleSaveLink} disabled={!newLinkTitle || !newLinkUrl} className="text-xs bg-[#a89984] text-black px-3 py-1 rounded font-bold hover:bg-opacity-80 disabled:opacity-50">Save</button>
                                </div>
                            </div>
                        )}
                        {resources.length > 0 ? resources.map(res => <KnowledgeResourceCard key={res.id} resource={res} onDelete={handleDeleteResource} />) : !isAddingLink && <div className="col-span-full text-center py-12 text-gray-500"><p className="text-sm">No resources found.</p><p className="text-xs mt-1">Add links or files to build your knowledge base.</p></div>}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-800"><button onClick={handleStartAddLink} className="px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 text-xs font-bold uppercase tracking-wider flex items-center transition-colors"><span className="text-lg mr-2 leading-none">+</span> Add Link</button><button onClick={handleUploadClick} className="px-4 py-2 bg-[#a89984] text-black rounded-md hover:bg-[#bfa78a] text-xs font-bold uppercase tracking-wider flex items-center shadow-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Upload</button></div>
                </div>
            )}
        </div>
    );
};

export default React.memo(MoleculeDetail);
