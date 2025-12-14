
import React, { useMemo, useState } from 'react';
import { Molecule, WishlistItem, ActivityEvent, ScentNote, Formula } from '../types';
import OlfactoryMindmap from './shared/OlfactoryMindmap';
import { ViewType } from '../App';
import FormulaOverviewPanel from './FormulaOverviewPanel';

interface DashboardProps {
    allMolecules: Molecule[];
    formulas: Formula[];
    onSelectMolecule: (id: string) => void;
    onSelectFormula: (id: string) => void;
    wishlist: WishlistItem[];
    onAddWishlistItem: (item: Omit<WishlistItem, 'id'>) => void;
    onRemoveWishlistItem: (id: string) => void;
    activityFeed: ActivityEvent[];
    onSeeAllActivity: () => void;
    onSetView: (view: ViewType) => void;
    currencySymbol: string;
}

const InfoCard: React.FC<{title: string; value: string; description: string;}> = ({ title, value, description }) => (
    <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{description}</p>
    </div>
);

const ActivityFeed: React.FC<{ feed: ActivityEvent[], onSelectMolecule: (id: string) => void, onSelectFormula: (id: string) => void, allMolecules: Molecule[], onSeeAllActivity: () => void }> = ({ feed, onSelectMolecule, onSelectFormula, allMolecules, onSeeAllActivity }) => {
    const getEventDetails = (event: ActivityEvent) => {
        switch (event.type) {
            case 'molecule':
                const molecule = event.data as Molecule;
                return { 
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="7" cy="7" r="3" /><circle cx="15" cy="10" r="6" /><circle cx="9" cy="17" r="2" /></svg>,
                    title: molecule.name,
                    description: "New material added",
                    onClick: () => onSelectMolecule(molecule.id)
                };
            case 'formula':
                const formula = event.data as Formula;
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
                    title: formula.name,
                    description: "Formula created",
                    onClick: () => onSelectFormula(formula.id)
                };
            case 'note':
                const note = event.data as ScentNote;
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
                    title: `Note on ${allMolecules.find(m => m.id === note.moleculeId)?.name || '...'}`,
                    description: `"${note.text.substring(0, 20)}..."`,
                    onClick: () => onSelectMolecule(note.moleculeId)
                };
            default:
                return { icon: null, title: 'Unknown Event', description: '' };
        }
    }

    return (
        <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-full flex flex-col shadow-sm dark:shadow-none">
            <h3 className="text-sm font-semibold text-[#a89984] mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex-shrink-0">Recent Activity</h3>
            <ul className="space-y-3 flex-grow overflow-y-auto pr-2">
                {feed.map(event => {
                    const { icon, title, description, onClick } = getEventDetails(event);
                    return (
                        <li key={`${event.type}-${event.data.id}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#a89984]/20 transition-colors">
                                <div className="flex-shrink-0 bg-[#a89984] rounded-full p-2 text-white">
                                    {icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-200">{title}</p>
                                    <p className="text-xs text-gray-500">{description} - <span className="italic">{new Date(event.date).toLocaleDateString()}</span></p>
                                </div>
                            </a>
                        </li>
                    )
                })}
            </ul>
             <div className="mt-auto pt-2 flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
                <button 
                    onClick={onSeeAllActivity} 
                    className="w-full text-center py-2 text-sm font-semibold text-[#a89984] hover:text-opacity-80 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    See All Activity
                </button>
            </div>
        </div>
    );
};

const Wishlist: React.FC<{ items: WishlistItem[]; onAddItem: (item: Omit<WishlistItem, 'id'>) => void; onRemoveItem: (id: string) => void; }> = ({ items, onAddItem, onRemoveItem }) => {
    const [newItem, setNewItem] = useState({ name: '', note: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.name.trim() === '') return;
        onAddItem(newItem);
        setNewItem({ name: '', note: '' });
    }
    
    return (
        <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col h-full shadow-sm dark:shadow-none">
            <h3 className="text-sm font-semibold text-[#a89984] mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex-shrink-0">Wishlist</h3>
            <ul className="space-y-2 flex-grow overflow-y-auto mb-3">
                {items.map(item => (
                    <li key={item.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-transparent">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 mr-2">
                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-200">
                                  {item.name}
                                </p>
                                {item.note && (
                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.note}</p>
                                )}
                            </div>
                            <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-400 font-bold p-1 rounded-full text-lg leading-none flex items-center justify-center h-5 w-5 ml-2 flex-shrink-0">
                               &times;
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} className="flex-shrink-0 mt-auto space-y-2">
                 <input 
                    type="text" 
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    placeholder="Material Name"
                    className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a89984] text-sm"
                    required
                />
                 <input 
                    type="text"
                    name="note"
                    value={newItem.note}
                    onChange={handleInputChange}
                    placeholder="Note (e.g., 'For floral accord')"
                    className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a89984] text-sm"
                 />
                <button type="submit" className="w-full bg-[#a89984] text-black font-bold py-2 rounded-md text-sm hover:bg-opacity-80 transition-colors">Add to Wishlist</button>
            </form>
        </div>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ allMolecules, formulas, onSelectMolecule, onSelectFormula, wishlist, onAddWishlistItem, onRemoveWishlistItem, activityFeed, onSeeAllActivity, onSetView, currencySymbol }) => {

    const stats = useMemo(() => {
        const totalValue = allMolecules.reduce((sum, m) => sum + (m.totalStock || 0) * (m.avgCostPerGram || 0), 0);
        return {
            totalMolecules: allMolecules.length,
            totalValue: totalValue.toFixed(2),
            totalFormulas: formulas.length,
        };
    }, [allMolecules, formulas]);
    

    return (
        <>
            <div className="space-y-8 animate-fade-in pt-12">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Your central hub for inventory insights, recent formulas, and lab activity.</p>
                </div>
                
                {/* Main Grid: Two large panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-[570px] flex flex-col shadow-sm dark:shadow-none">
                        <h3 className="text-sm font-semibold text-[#a89984] mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Scent Bank</h3>
                        <div className="flex-grow relative">
                           <OlfactoryMindmap 
                                key={allMolecules.length}
                                molecules={allMolecules}
                           />
                        </div>
                    </div>
                    <div className="h-[570px]">
                        <FormulaOverviewPanel formulas={formulas} molecules={allMolecules} onSetView={onSetView} onSelectFormula={onSelectFormula} />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoCard title="TOTAL MATERIALS" value={stats.totalMolecules.toString()} description="Unique molecules in your library" />
                    <InfoCard title="TOTAL FORMULAS" value={stats.totalFormulas.toString()} description="User-created formulas" />
                    <InfoCard title="INVENTORY VALUE" value={`${currencySymbol}${stats.totalValue}`} description="Estimated value of all stock" />
                </div>
                
                {/* Secondary Grid: Two smaller cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <ActivityFeed feed={activityFeed} onSelectMolecule={onSelectMolecule} onSelectFormula={onSelectFormula} allMolecules={allMolecules} onSeeAllActivity={onSeeAllActivity} />
                     <Wishlist items={wishlist} onAddItem={onAddWishlistItem} onRemoveItem={onRemoveWishlistItem} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
