
import React, { useState, useMemo } from 'react';
import { Molecule } from '../../types';
import BaseModal from '../ui/BaseModal';

interface InventoryHubModalProps {
    molecules: Molecule[];
    onClose: () => void;
}

const InventoryHubModal: React.FC<InventoryHubModalProps> = ({ molecules, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [lowStockFilter, setLowStockFilter] = useState(false);
    const [lowStockThreshold, setLowStockThreshold] = useState(20);

    const filteredMolecules = useMemo(() => {
        return molecules
            .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(m => !lowStockFilter || (m.totalStock || 0) < lowStockThreshold);
    }, [molecules, searchTerm, lowStockFilter, lowStockThreshold]);

    return (
        <BaseModal title="Inventory Hub" onClose={onClose} size="full">
            <div className="flex flex-col h-full">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 pb-4 border-b border-gray-800 space-y-4 md:space-y-0">
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 bg-[#111111] border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a89984]"
                    />
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="lowStockToggle"
                                checked={lowStockFilter}
                                onChange={(e) => setLowStockFilter(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#a89984] focus:ring-[#a89984]"
                            />
                            <label htmlFor="lowStockToggle" className="ml-2 text-sm text-gray-300">Show Low Stock Only</label>
                        </div>
                        <div className="flex items-center">
                             <label htmlFor="lowStockThreshold" className="mr-2 text-sm text-gray-300">Threshold (g):</label>
                             <input
                                type="number"
                                id="lowStockThreshold"
                                value={lowStockThreshold}
                                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                                className="w-20 bg-[#111111] border border-gray-700 rounded-md px-2 py-1 text-white"
                             />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-grow overflow-y-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-[#111111] sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Material</th>
                                <th className="px-4 py-3 text-right">Total Stock (g)</th>
                                <th className="px-4 py-3 text-right">Avg. Cost/g</th>
                                <th className="px-4 py-3 text-right">Total Value</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredMolecules.map(molecule => {
                                const totalStock = molecule.totalStock || 0;
                                const avgCost = molecule.avgCostPerGram || 0;
                                const totalValue = totalStock * avgCost;
                                const isLowStock = totalStock < lowStockThreshold;
                                
                                return (
                                    <tr key={molecule.id} className={isLowStock ? 'bg-red-900/40' : ''}>
                                        <td className="px-4 py-3 font-medium text-white">{molecule.name}</td>
                                        <td className="px-4 py-3 text-right font-mono">{totalStock.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-mono">${avgCost.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-mono">${totalValue.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {isLowStock && <span className="text-xs font-semibold bg-red-600 text-white px-2 py-1 rounded-full">LOW</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseModal>
    );
};

export default InventoryHubModal;
