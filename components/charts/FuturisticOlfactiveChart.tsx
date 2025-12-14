import React, { useMemo } from 'react';
import { OlfactiveFamily } from '../../types';
import { CATEGORY_HEX_COLORS } from '../../constants';

interface FuturisticOlfactiveChartProps {
    familyData: Record<string, number>;
}

const FuturisticOlfactiveChart: React.FC<FuturisticOlfactiveChartProps> = ({ familyData }) => {
    
    const orbs = useMemo(() => {
        const entries = Object.keys(familyData).map(key => [key, familyData[key]] as const).filter(([, count]) => count > 0);
        const totalCount = entries.reduce((sum, [, count]) => sum + count, 1);
        
        return entries.map(([family, count], index) => {
            const size = 15 + (count / totalCount) * 45; // Orb size from 15px to 60px
            const orbitRadius = 30 + Math.random() * 40; // Varying orbit radiuses from 30 to 70
            const duration = 20 + Math.random() * 20; // Varying speeds from 20s to 40s
            const delay = Math.random() * -duration; // Random start position

            return {
                family: family as OlfactiveFamily,
                count,
                size,
                orbitRadius,
                duration,
                delay
            };
        });
    }, [familyData]);
    
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <style>
                {`
                @keyframes orbit {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .orb-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform-origin: center;
                    animation: orbit linear infinite;
                }
                .orb {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }
                .orb-container:hover {
                    animation-play-state: paused;
                    z-index: 10;
                }
                .orb-container:hover .orb {
                    transform: translate(-50%, -50%) scale(1.2);
                }
                 .orb-container:hover .tooltip {
                    opacity: 1;
                    transform: translate(-50%, -130%);
                 }
                .tooltip {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -150%);
                    background-color: #111;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    pointer-events: none;
                    z-index: 20;
                }
                `}
            </style>
            {/* Central Sun */}
            <div className="w-4 h-4 bg-gray-600 rounded-full shadow-[0_0_10px_rgba(200,200,200,0.4)]"></div>

            {orbs.map(orb => (
                <div
                    key={orb.family}
                    className="orb-container"
                    style={{
                        width: `${orb.orbitRadius * 2}px`,
                        height: `${orb.orbitRadius * 2}px`,
                        margin: `-${orb.orbitRadius}px 0 0 -${orb.orbitRadius}px`,
                        animationDuration: `${orb.duration}s`,
                        animationDelay: `${orb.delay}s`,
                    }}
                >
                    <div
                        className="orb"
                        style={{
                            width: `${orb.size}px`,
                            height: `${orb.size}px`,
                            backgroundColor: CATEGORY_HEX_COLORS[orb.family],
                            boxShadow: `0 0 10px ${CATEGORY_HEX_COLORS[orb.family]}`,
                            top: 0, 
                        }}
                    >
                         <div className="tooltip">
                            {orb.family}: {orb.count}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FuturisticOlfactiveChart;