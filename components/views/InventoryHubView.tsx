
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Molecule } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface InventoryHubViewProps {
    molecules: Molecule[];
    currencySymbol: string;
}

interface TreemapItem {
    id: string;
    name: string;
    value: number;
    color: string;
    stock: number;
    family: string;
}

interface TreemapLayout extends TreemapItem {
    x: number;
    y: number;
    w: number;
    h: number;
}

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
);

const generateTreemapLayout = (items: TreemapItem[], width: number, height: number): TreemapLayout[] => {
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);
    if (totalValue <= 0 || width <= 0 || height <= 0) return [];

    const sortedItems = items.map(item => ({
        ...item,
        normalizedValue: item.value / totalValue
    })).sort((a, b) => b.normalizedValue - a.normalizedValue);

    const layout = (items: (TreemapItem & { normalizedValue: number })[], x: number, y: number, w: number, h: number): TreemapLayout[] => {
        if (items.length === 0) return [];
        if (items.length === 1) return [{ ...items[0], x, y, w, h }];

        const totalNormalizedValue = items.reduce((sum, item) => sum + item.normalizedValue, 0);
        
        let currentSum = 0;
        let splitIndex = 0;
        for(let i=0; i < items.length - 1; i++) {
            if(currentSum > totalNormalizedValue / 2) break;
            currentSum += items[i].normalizedValue;
            splitIndex = i;
        }

        const a = items.slice(0, splitIndex + 1);
        const b = items.slice(splitIndex + 1);
        
        const aSum = a.reduce((sum, item) => sum + item.normalizedValue, 0);
        const ratio = aSum / totalNormalizedValue;

        if (w > h) { 
            const wA = w * ratio;
            return [
                ...layout(a, x, y, wA, h),
                ...layout(b, x + wA, y, w - wA, h)
            ];
        } else {
            const hA = h * ratio;
            return [
                ...layout(a, x, y, w, hA),
                ...layout(b, x, y + hA, w, h - hA)
            ];
        }
    };
    return layout(sortedItems, 0, 0, width, height);
};


const InventoryHubView: React.FC<InventoryHubViewProps> = ({ molecules, currencySymbol }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(20);
    const [viewMode, setViewMode] = useState<'treemap' | 'table'>('treemap');
    const [tooltip, setTooltip] = useState<{ content: React.ReactNode; x: number; y: number } | null>(null);
    const treemapContainerRef = useRef<HTMLDivElement>(null);
    const [treemapDims, setTreemapDims] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setTreemapDims({ width, height });
            }
        });
        if (treemapContainerRef.current) {
            observer.observe(treemapContainerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    const filteredMolecules = useMemo(() => {
        return molecules.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [molecules, searchTerm]);

    const inventoryStats = useMemo(() => {
        const totalValue = molecules.reduce((sum, m) => sum + (m.totalStock || 0) * (m.avgCostPerGram || 0), 0);
        const lowStockCount = molecules.filter(m => (m.totalStock || 0) < lowStockThreshold).length;
        return {
            totalValue: `${currencySymbol}${totalValue.toFixed(2)}`,
            materialCount: molecules.length,
            lowStockCount,
        };
    }, [molecules, lowStockThreshold, currencySymbol]);

    const treemapLayout = useMemo(() => {
        const items: TreemapItem[] = filteredMolecules.map(m => ({
            id: m.id,
            name: m.name,
            value: (m.totalStock || 0) * (m.avgCostPerGram || 0) || 0.1, 
            color: CATEGORY_HEX_COLORS[m.olfactiveFamily],
            stock: m.totalStock || 0,
            family: m.olfactiveFamily
        }));
        return generateTreemapLayout(items, treemapDims.width, treemapDims.height);
    }, [filteredMolecules, treemapDims]);


    const handleMouseEnter = (event: React.MouseEvent, item: TreemapLayout) => {
        setTooltip({
            content: (
                <div className="text-xs text-left w-48">
                    <p className="font-bold text-white text-sm mb-1">{item.name}</p>
                    <p className="font-semibold" style={{ color: item.color }}>{item.family}</p>
                    <div className="mt-2 pt-2 border-t border-gray-700 text-gray-300 font-mono space-y-1">
                       <p>Value: {currencySymbol}{item.value.toFixed(2)}</p>
                       <p>Stock: {item.stock.toFixed(2)}g</p>
                    </div>
                </div>
            ),
            x: event.clientX,
            y: event.clientY,
        });
    };
    const handleMouseLeave = () => setTooltip(null);


    return (
        <div className="flex flex-col h-full animate-fade-in pt-12">
            {tooltip && (
                <div 
                    className="fixed z-50 bg-black border border-gray-700 rounded-md shadow-lg p-3 pointer-events-none"
                    style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
                >
                    {tooltip.content}
                </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Inventory Hub</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <StatCard title="INVENTORY VALUE" value={inventoryStats.totalValue} />
                <StatCard title="UNIQUE MATERIALS" value={inventoryStats.materialCount.toString()} />
                <StatCard title="LOW STOCK ITEMS" value={inventoryStats.lowStockCount.toString()} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 p-4 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg space-y-4 md:space-y-0 shadow-sm dark:shadow-none">
                <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 bg-gray-50 dark:bg-[#111111] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#a89984]"
                />
                <div className="flex items-center space-x-2">
                    <button onClick={() => setViewMode('treemap')} className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${viewMode === 'treemap' ? 'bg-[#a89984] text-black' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Treemap</button>
                    <button onClick={() => setViewMode('table')} className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${viewMode === 'table' ? 'bg-[#a89984] text-black' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Table</button>
                </div>
                <div className="flex items-center w-full md:w-1/3 space-x-2">
                     <label htmlFor="lowStockThreshold" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Threshold &lt; {lowStockThreshold}g</label>
                     <input
                        type="range"
                        min="0"
                        max="100"
                        id="lowStockThreshold"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                        className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                     />
                </div>
            </div>

            {viewMode === 'treemap' ? (
                <div className="flex-grow bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg p-2 relative shadow-sm dark:shadow-none" ref={treemapContainerRef}>
                    {treemapLayout.map(item => {
                        const isLowStock = item.stock < lowStockThreshold;
                        return (
                            <div
                                key={item.id}
                                onMouseEnter={(e) => handleMouseEnter(e, item)}
                                onMouseLeave={handleMouseLeave}
                                className="absolute border-2 border-white dark:border-[#1C1C1C] rounded-sm transition-opacity duration-300 flex items-center justify-center p-1 overflow-hidden"
                                style={{
                                    left: item.x,
                                    top: item.y,
                                    width: item.w,
                                    height: item.h,
                                    backgroundColor: item.color,
                                    opacity: isLowStock ? 0.3 : 1,
                                }}
                            >
                                {(item.w > 60 && item.h > 20) && (
                                    <span className="text-xs text-white font-semibold truncate" style={{ textShadow: '0px 0px 4px black' }}>
                                        {item.name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm dark:shadow-none">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#111111] sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Material</th>
                                <th className="px-4 py-3 text-right">Total Stock (g)</th>
                                <th className="px-4 py-3 text-right">Cost/g</th>
                                <th className="px-4 py-3 text-right">Total Value</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredMolecules.map(molecule => {
                                const totalStock = molecule.totalStock || 0;
                                const avgCost = molecule.avgCostPerGram || 0;
                                const totalValue = totalStock * avgCost;
                                const isLowStock = totalStock < lowStockThreshold;
                                return (
                                    <tr key={molecule.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isLowStock ? 'bg-red-100 dark:bg-red-900/20' : ''}`}>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{molecule.name}</td>
                                        <td className="px-4 py-3 text-right font-mono">{totalStock.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-mono">{currencySymbol}{avgCost.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-mono">{currencySymbol}{totalValue.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {isLowStock && <span className="text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-600 dark:text-white px-2 py-1 rounded-full">LOW</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InventoryHubView;
