
import React from 'react';
import { OlfactiveFamily } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface MindmapLegendProps {
    familyCounts: Record<string, number>;
}

const MindmapLegend: React.FC<MindmapLegendProps> = ({ familyCounts }) => {
    const sortedFamilies = (Object.keys(familyCounts) as OlfactiveFamily[])
        .filter(family => familyCounts[family] > 0)
        .sort((a, b) => familyCounts[b] - familyCounts[a]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4">
            {sortedFamilies.map(family => (
                <div key={family} className="flex items-center space-x-2">
                    <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: CATEGORY_HEX_COLORS[family] }}
                    ></span>
                    <span className="text-xs text-gray-400">{family}</span>
                    <span className="text-xs font-mono text-gray-500">({familyCounts[family]})</span>
                </div>
            ))}
        </div>
    );
};

export default MindmapLegend;
