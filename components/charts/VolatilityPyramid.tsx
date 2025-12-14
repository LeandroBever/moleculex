
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { OlfactiveFamily } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';
import { TierMolecule } from '../modals/FormulaDNAModal';

interface VolatilityPyramidProps {
    volatilityData: {
        top: number;
        heart: number;
        base: number;
        topMolecules: TierMolecule[];
        topHeartMolecules: TierMolecule[];
        heartMolecules: TierMolecule[];
        heartBaseMolecules: TierMolecule[];
        baseMolecules: TierMolecule[];
    };
}

// Define fixed percentages for the visual representation of the tiers
const FIXED_TIER_PERCENTAGES = {
    top: 25,
    heart: 40,
    base: 35,
};

const VolatilityPyramid: React.FC<VolatilityPyramidProps> = ({ volatilityData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ width: 0, height: 0 });
    const { topMolecules, topHeartMolecules, heartMolecules, heartBaseMolecules, baseMolecules } = volatilityData;

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDims({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        updateDimensions();
        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    const placedMolecules = useMemo(() => {
        if (dims.width === 0 || dims.height === 0) return [];

        const { width, height } = dims;
        const topHeight = height * (FIXED_TIER_PERCENTAGES.top / 100);
        const heartHeight = height * (FIXED_TIER_PERCENTAGES.heart / 100);
        const lineY1 = topHeight;
        const lineY2 = topHeight + heartHeight;
        const slope = (width / 2) / height;

        const getRandomPointInTier = (tier: 'top' | 'heart' | 'base', radius: number): { x: number; y: number } => {
            let yMin, yMax, tierStartY, tierEndY;

            switch (tier) {
                case 'top':
                    [tierStartY, tierEndY] = [0, lineY1];
                    break;
                case 'heart':
                    [tierStartY, tierEndY] = [lineY1, lineY2];
                    break;
                case 'base':
                default:
                    [tierStartY, tierEndY] = [lineY2, height];
                    break;
            }
            
            yMin = tierStartY + radius;
            yMax = tierEndY - radius;

            if (yMin >= yMax) {
                const midY = (tierStartY + tierEndY) / 2;
                return { x: width / 2, y: midY };
            }
            
            const y = yMin + Math.random() * (yMax - yMin);
            
            const tierWidthAtY = y * slope * 2;
            const xOffset = (width - tierWidthAtY) / 2;
            
            const xMin = xOffset + radius;
            const xMax = width - xOffset - radius;
            
            if (xMin >= xMax) {
                 return { x: width / 2, y: y };
            }

            const x = xMin + Math.random() * (xMax - xMin);

            return { x, y };
        };
        
        const getRandomPointOnLine = (lineY: number, radius: number): { x: number, y: number } => {
            const y = lineY;
            const tierWidthAtY = y * slope * 2;
            const xOffset = (width - tierWidthAtY) / 2;
            
            const xMin = xOffset + radius;
            const xMax = width - xOffset - radius;

            if (xMin >= xMax) {
                return { x: width / 2, y: y };
            }

            const x = xMin + Math.random() * (xMax - xMin);
            return { x, y };
        };
        
        const allAmounts = [
            ...topMolecules, ...topHeartMolecules, ...heartMolecules, ...heartBaseMolecules, ...baseMolecules
        ].map(m => m.amount);
        const maxAmount = Math.max(...allAmounts, 1);
        
        const mapMoleculeToProps = (mol: TierMolecule) => {
            const minRadius = 4;
            const maxRadius = 20;
            const radius = Math.max(2, minRadius + (mol.amount / maxAmount) * (maxRadius - minRadius));
            return {
                ...mol,
                r: radius,
                color: CATEGORY_HEX_COLORS[mol.family],
            };
        };
        
        const generatePoints = (molecules: TierMolecule[], tier: 'top' | 'heart' | 'base') => {
            if (molecules.length === 0) return [];
            return molecules.map(mol => {
                const props = mapMoleculeToProps(mol);
                const { x, y } = getRandomPointInTier(tier, props.r);
                return { ...props, cx: x, cy: y };
            });
        };

        const generatePointsOnLine = (molecules: TierMolecule[], lineY: number) => {
            if (molecules.length === 0) return [];
            return molecules.map(mol => {
                const props = mapMoleculeToProps(mol);
                const { x, y } = getRandomPointOnLine(lineY, props.r);
                return { ...props, cx: x, cy: y };
            });
        };

        return [
            ...generatePoints(topMolecules, 'top'),
            ...generatePointsOnLine(topHeartMolecules, lineY1),
            ...generatePoints(heartMolecules, 'heart'),
            ...generatePointsOnLine(heartBaseMolecules, lineY2),
            ...generatePoints(baseMolecules, 'base'),
        ];
    }, [dims, topMolecules, topHeartMolecules, heartMolecules, heartBaseMolecules, baseMolecules]);

    const { width, height } = dims;
    
    const pyramidPoints = `0,${height} ${width / 2},0 ${width},${height}`;
    
    const lineY1 = height * (FIXED_TIER_PERCENTAGES.top / 100);
    const lineY2 = lineY1 + height * (FIXED_TIER_PERCENTAGES.heart / 100);
    
    const getWidthAtY = (y: number) => (y / height) * width;
    
    const x1_line1 = (width - getWidthAtY(lineY1)) / 2;
    const x2_line1 = width - x1_line1;

    const x1_line2 = (width - getWidthAtY(lineY2)) / 2;
    const x2_line2 = width - x1_line2;


    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-full flex-grow relative" ref={containerRef}>
                {(width > 0 && height > 0) && (
                    <svg viewBox={`0 0 ${width} ${height}`} className="absolute top-0 left-0 w-full h-full overflow-visible">
                        <g className="pyramid-structure">
                            <polygon 
                                points={pyramidPoints} 
                                fill="none" 
                                className="stroke-gray-300 dark:stroke-gray-600" 
                                strokeWidth="2" 
                            />
                            <line 
                                x1={x1_line1} y1={lineY1} x2={x2_line1} y2={lineY1} 
                                className="stroke-gray-300 dark:stroke-gray-600" 
                                strokeWidth="1.5" 
                                strokeDasharray="4 4" 
                            />
                            <line 
                                x1={x1_line2} y1={lineY2} x2={x2_line2} y2={lineY2} 
                                className="stroke-gray-300 dark:stroke-gray-600" 
                                strokeWidth="1.5" 
                                strokeDasharray="4 4" 
                            />
                        </g>
                        
                        {/* Labels */}
                        <text 
                            x={width/2} 
                            y={lineY1 / 2} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            className="fill-gray-400 dark:fill-gray-400 text-[11px] font-bold tracking-widest select-none"
                        >
                            TOP
                        </text>
                        <text 
                            x={width/2} 
                            y={lineY1 + (lineY2 - lineY1) / 2} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            className="fill-gray-400 dark:fill-gray-400 text-[11px] font-bold tracking-widest select-none"
                        >
                            HEART
                        </text>
                        <text 
                            x={width/2} 
                            y={lineY2 + (height - lineY2) / 2} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            className="fill-gray-400 dark:fill-gray-400 text-[11px] font-bold tracking-widest select-none"
                        >
                            BASE
                        </text>

                        <g className="molecule-circles">
                            {placedMolecules.map(mol => (
                                <circle
                                    key={mol.id}
                                    cx={mol.cx}
                                    cy={mol.cy}
                                    r={mol.r}
                                    fill={mol.color}
                                    fillOpacity="0.9"
                                    className="cursor-help transition-all duration-200"
                                >
                                    <title>{`${mol.name} (${mol.amount.toFixed(1)})`}</title>
                                </circle>
                            ))}
                        </g>
                    </svg>
                )}
            </div>
        </div>
    );
};

export default VolatilityPyramid;
