
import React, { useState, useMemo } from 'react';
import { Molecule, OlfactiveFamily } from '../../types';
import OlfactoryMindmap from '../shared/OlfactoryMindmap';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface LibraryViewProps {
    molecules: Molecule[];
    onSelectMolecule: (id: string) => void;
    currencySymbol: string;
}

type SortField = 'date' | 'name' | 'family' | 'supplier' | 'amount' | 'cost' | 'total';
type SortDirection = 'asc' | 'desc';

const LibraryView: React.FC<LibraryViewProps> = ({ molecules, onSelectMolecule, currencySymbol }) => {
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc'); // Default to descending for new fields usually feels better for data
        }
    };

    const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
        if (sortField !== field) return <span className="ml-1 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-50">↕</span>;
        return <span className="ml-1 text-[#a89984]">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };
    
    const purchaseHistory = useMemo(() => {
        const history: Array<{
            id: string;
            moleculeId: string;
            name: string;
            family: OlfactiveFamily;
            date: string;
            amount: number;
            cost: number;
            total: number;
            supplier: string;
        }> = [];

        molecules.forEach(mol => {
            mol.inventoryBatches.forEach(batch => {
                history.push({
                    id: batch.id,
                    moleculeId: mol.id,
                    name: mol.name,
                    family: mol.olfactiveFamily,
                    date: batch.purchaseDate,
                    amount: batch.stockAmount,
                    cost: batch.costPerGram,
                    total: batch.stockAmount * batch.costPerGram,
                    supplier: batch.lab || batch.supplier || 'Unknown'
                });
            });
        });

        // Filter based on search term
        const filteredHistory = history.filter(item => {
            if (!searchTerm) return true;
            const lowerTerm = searchTerm.toLowerCase();
            return (
                item.name.toLowerCase().includes(lowerTerm) ||
                item.supplier.toLowerCase().includes(lowerTerm) ||
                item.family.toLowerCase().includes(lowerTerm)
            );
        });

        return filteredHistory.sort((a, b) => {
            let valA: any = a[sortField];
            let valB: any = b[sortField];

            if (sortField === 'date') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            } else if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [molecules, sortField, sortDirection, searchTerm]);

    return (
        <div className="animate-fade-in pt-12 h-full flex flex-col space-y-6">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Molecules</h1>
                <p className="text-gray-600 dark:text-gray-400">Browse your collection visually or analyze your acquisition history.</p>
            </div>
            
            {/* Map Container */}
            <div className="h-[500px] relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex-shrink-0 p-4 shadow-sm dark:shadow-none">
                <OlfactoryMindmap 
                    key={molecules.length}
                    molecules={molecules} 
                />
            </div>

            {/* Purchase History Table */}
            <div className="flex-grow bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 overflow-hidden flex flex-col min-h-[400px] shadow-sm dark:shadow-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#a89984]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Inventory
                    </h3>
                    <div className="relative w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search name, facet, role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a89984] pl-9"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                
                <div className="overflow-y-auto flex-grow">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#111] sticky top-0">
                            <tr>
                                <th 
                                    className="px-4 py-3 cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                                    onClick={() => handleSort('date')}
                                >
                                    Date <SortIcon field="date" />
                                </th>
                                <th 
                                    className="px-4 py-3 cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                                    onClick={() => handleSort('name')}
                                >
                                    Material <SortIcon field="name" />
                                </th>
                                <th 
                                    className="px-4 py-3 cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                                    onClick={() => handleSort('family')}
                                >
                                    Family <SortIcon field="family" />
                                </th>
                                <th 
                                    className="px-4 py-3 cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                                    onClick={() => handleSort('supplier')}
                                >
                                    Supplier <SortIcon field="supplier" />
                                </th>
                                <th 
                                    className="px-4 py-3 text-right cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                                    onClick={() => handleSort('amount')}
                                >
                                    Amount (g) <SortIcon field="amount" />
                                </th>
                                <th 
                                    className="px-4 py-3 text-right cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                                    onClick={() => handleSort('cost')}
                                >
                                    Cost/g <SortIcon field="cost" />
                                </th>
                                <th 
                                    className="px-4 py-3 text-right cursor-pointer hover:text-gray-900 dark:hover:text-white group select-none"
                                    onClick={() => handleSort('total')}
                                >
                                    Total <SortIcon field="total" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {purchaseHistory.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        <button 
                                            onClick={() => onSelectMolecule(item.moleculeId)}
                                            className="hover:text-[#a89984] hover:underline text-left"
                                        >
                                            {item.name}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span 
                                            className="text-xs px-2 py-1 rounded-full text-black font-semibold whitespace-nowrap"
                                            style={{ backgroundColor: CATEGORY_HEX_COLORS[item.family] }}
                                        >
                                            {item.family}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{item.supplier}</td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">{item.amount}</td>
                                    <td className="px-4 py-3 text-right font-mono">{currencySymbol}{item.cost.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-[#a89984] font-bold">{currencySymbol}{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            {purchaseHistory.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        {searchTerm ? 'No matching purchases found.' : 'No purchase history found. Add inventory batches to your materials to populate this list.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LibraryView;
