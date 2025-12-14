
import React, { useState, useMemo } from 'react';
import { Molecule, OlfactiveFamily } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface RelationshipExplorerViewProps {
    molecules: Molecule[];
}

const RelationshipExplorerView: React.FC<RelationshipExplorerViewProps> = ({ molecules }) => {
    const [hoveredMolecule, setHoveredMolecule] = useState<string | null>(null);

    // 1. Sort molecules by impact (longevity in hours)
    const sortedMolecules = useMemo(() => {
        return [...molecules].sort((a, b) => a.impact - b.impact);
    }, [molecules]);

    // 2. Group into Pyramids
    const tiers = useMemo(() => {
        return {
            top: sortedMolecules.filter(m => m.impact < 3), // < 3 hours
            heart: sortedMolecules.filter(m => m.impact >= 3 && m.impact < 24), // 3 to 24 hours
            base: sortedMolecules.filter(m => m.impact >= 24) // > 24 hours
        };
    }, [sortedMolecules]);

    // 3. Helper for Logarithmic Scale positioning (0.1h to 500h)
    const getPositionX = (impact: number) => {
        const minLog = Math.log(0.1);
        const maxLog = Math.log(500); // Cap at 500h for visual spacing
        const valLog = Math.log(Math.max(0.1, Math.min(500, impact)));
        const percent = ((valLog - minLog) / (maxLog - minLog)) * 100;
        return Math.max(2, Math.min(98, percent)); // Clamp between 2% and 98%
    };

    // 4. Helper for Linear Scale positioning (Odor Strength 1-10)
    // 10 (Strong) -> Top (10%)
    // 1 (Subtle) -> Bottom (90%)
    const getPositionY = (strength: number) => {
        // Map 1-10 to percentage, inverted so 10 is at top
        const percent = 100 - ((strength / 10) * 100);
        // Compress slightly to avoid edges (10% to 90%)
        return 10 + (percent * 0.8);
    };

    // 5. Deterministic Pseudo-random jitter to prevent exact overlaps
    const getJitter = (seed: string) => {
        let h = 0x811c9dc5;
        for (let i = 0; i < seed.length; i++) {
            h ^= seed.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
        }
        const val = ((h >>> 0) / 4294967296); 
        return (val - 0.5) * 4; // +/- 2% jitter
    };

    const renderMoleculeNode = (m: Molecule) => {
        const left = getPositionX(m.impact) + getJitter(m.id);
        const top = getPositionY(m.odorStrength) + getJitter(m.name);
        const isHovered = hoveredMolecule === m.id;

        return (
            <div
                key={m.id}
                onMouseEnter={() => setHoveredMolecule(m.id)}
                onMouseLeave={() => setHoveredMolecule(null)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer z-10 ${isHovered ? 'scale-150 z-50' : 'hover:scale-125'}`}
                style={{
                    left: `${left}%`,
                    top: `${top}%`,
                }}
            >
                <div 
                    className={`rounded-full shadow-lg transition-all duration-300 ${isHovered ? 'ring-2 ring-white' : ''}`}
                    style={{
                        backgroundColor: CATEGORY_HEX_COLORS[m.olfactiveFamily],
                        width: `${Math.max(10, m.odorStrength * 1.5 + 4)}px`, // Size correlates slightly with strength
                        height: `${Math.max(10, m.odorStrength * 1.5 + 4)}px`,
                        opacity: isHovered ? 1 : 0.85,
                        boxShadow: isHovered ? `0 0 15px ${CATEGORY_HEX_COLORS[m.olfactiveFamily]}` : 'none'
                    }}
                />
                {/* Tooltip */}
                {isHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-[#000000] border border-gray-700 p-3 rounded-lg shadow-2xl pointer-events-none z-50">
                        <p className="text-white font-bold text-sm">{m.name}</p>
                        <p className="text-xs font-semibold mb-2" style={{color: CATEGORY_HEX_COLORS[m.olfactiveFamily]}}>{m.olfactiveFamily}</p>
                        <div className="border-t border-gray-800 pt-2 text-xs text-gray-400 space-y-1">
                            <div className="flex justify-between"><span>Longevity:</span> <span className="text-white font-mono">{m.impact}h</span></div>
                            <div className="flex justify-between"><span>Strength:</span> <span className="text-white font-mono">{m.odorStrength}/10</span></div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-700"></div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in pt-12 h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <h1 className="text-3xl font-bold text-white">Volatility Spectrum</h1>
                <p className="text-gray-400 mt-2">
                    A 2D map of your olfactory library. X-Axis represents <strong>Evaporation Time</strong> (Longevity), while Y-Axis represents <strong>Odor Strength</strong> (Impact).
                </p>
            </div>

            {/* 1. The Spectrum Chart */}
            <div className="bg-[#1C1C1C] border border-gray-800 rounded-lg p-6 mb-8 relative h-[600px] flex flex-col justify-center select-none overflow-hidden shadow-inner">
                
                {/* Background Gradient */}
                <div className="absolute inset-0 opacity-5" style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(168, 153, 132, 0.3) 0%, transparent 70%)'
                }}></div>

                {/* Vertical Grid Lines (Time) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                     {[1, 10, 100, 500].map(val => (
                         <div key={val} className="absolute h-full border-l border-gray-800/50 border-dashed text-[10px] text-gray-600 pl-1 pt-2" style={{ left: `${getPositionX(val)}%` }}>
                             {val}h
                         </div>
                     ))}
                </div>

                {/* Horizontal Grid Lines (Strength) */}
                 <div className="absolute inset-0 w-full h-full pointer-events-none">
                     {[2, 4, 6, 8].map(val => (
                         <div key={val} className="absolute w-full border-t border-gray-800/30" style={{ top: `${getPositionY(val)}%` }}></div>
                     ))}
                </div>

                {/* Axis Labels */}
                <div className="absolute top-4 left-4 bottom-12 flex flex-col justify-between text-[10px] font-bold text-gray-600 tracking-widest pointer-events-none">
                    <span className="text-[#a89984]">POWERFUL</span>
                    <span className="text-gray-700">SUBTLE</span>
                </div>
                
                <div className="absolute bottom-3 left-12 right-4 flex justify-between text-[10px] font-bold text-gray-600 tracking-widest pointer-events-none uppercase">
                    <span className="text-yellow-600/70">Top Notes</span>
                    <span className="text-pink-600/70">Heart Notes</span>
                    <span className="text-stone-600/70">Base Notes</span>
                </div>

                {/* Molecules Container */}
                <div className="relative w-full h-full">
                    {sortedMolecules.map((m) => renderMoleculeNode(m))}
                </div>
                
            </div>

            {/* 2. The Ranked Lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-hidden">
                
                {/* Top Notes Column */}
                <div className="flex flex-col bg-[#111] border border-gray-800 rounded-lg h-full overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-yellow-900/10">
                        <h3 className="text-lg font-bold text-yellow-500">The Sprinters</h3>
                        <p className="text-xs text-gray-400">Top Notes • High Volatility • &lt; 3h</p>
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-1">
                        {tiers.top.map(m => (
                            <div key={m.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-800 group cursor-default">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_HEX_COLORS[m.olfactiveFamily] }}></span>
                                    <span className="text-sm text-gray-300 group-hover:text-white">{m.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                     <span className="text-[10px] text-gray-600 group-hover:text-gray-400" title="Strength">STR {m.odorStrength}</span>
                                     <span className="text-xs font-mono text-gray-500">{m.impact}h</span>
                                </div>
                            </div>
                        ))}
                        {tiers.top.length === 0 && <div className="text-center text-gray-600 py-4 text-sm">No top notes found.</div>}
                    </div>
                </div>

                {/* Heart Notes Column */}
                <div className="flex flex-col bg-[#111] border border-gray-800 rounded-lg h-full overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-pink-900/10">
                        <h3 className="text-lg font-bold text-pink-500">The Moderators</h3>
                        <p className="text-xs text-gray-400">Heart Notes • Medium Volatility • 3h - 24h</p>
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-1">
                        {tiers.heart.map(m => (
                             <div key={m.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-800 group cursor-default">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_HEX_COLORS[m.olfactiveFamily] }}></span>
                                    <span className="text-sm text-gray-300 group-hover:text-white">{m.name}</span>
                                </div>
                                 <div className="flex items-center space-x-3">
                                     <span className="text-[10px] text-gray-600 group-hover:text-gray-400" title="Strength">STR {m.odorStrength}</span>
                                     <span className="text-xs font-mono text-gray-500">{m.impact}h</span>
                                </div>
                            </div>
                        ))}
                        {tiers.heart.length === 0 && <div className="text-center text-gray-600 py-4 text-sm">No heart notes found.</div>}
                    </div>
                </div>

                {/* Base Notes Column */}
                <div className="flex flex-col bg-[#111] border border-gray-800 rounded-lg h-full overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-stone-900/10">
                        <h3 className="text-lg font-bold text-stone-500">The Anchors</h3>
                        <p className="text-xs text-gray-400">Base Notes • Low Volatility • &gt; 24h</p>
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-1">
                         {tiers.base.map(m => (
                             <div key={m.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-800 group cursor-default">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_HEX_COLORS[m.olfactiveFamily] }}></span>
                                    <span className="text-sm text-gray-300 group-hover:text-white">{m.name}</span>
                                </div>
                                 <div className="flex items-center space-x-3">
                                     <span className="text-[10px] text-gray-600 group-hover:text-gray-400" title="Strength">STR {m.odorStrength}</span>
                                     <span className="text-xs font-mono text-gray-500">{m.impact}h</span>
                                </div>
                            </div>
                        ))}
                        {tiers.base.length === 0 && <div className="text-center text-gray-600 py-4 text-sm">No base notes found.</div>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RelationshipExplorerView;
