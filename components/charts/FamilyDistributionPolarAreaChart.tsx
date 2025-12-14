
import React, { useEffect, useRef } from 'react';
import { OlfactiveFamily } from '../../types';
// @ts-ignore
import { Chart } from 'chart.js/auto';

interface FamilyDistributionPolarAreaChartProps {
    familyData: Record<string, number>;
    hideLegend?: boolean;
}

const familyColors: Record<OlfactiveFamily, string> = {
    [OlfactiveFamily.CITRUS]: 'rgba(250, 204, 21, 0.7)',
    [OlfactiveFamily.FLORAL]: 'rgba(244, 114, 182, 0.7)',
    [OlfactiveFamily.WOODY]: 'rgba(180, 83, 9, 0.7)',
    [OlfactiveFamily.SPICY]: 'rgba(239, 68, 68, 0.7)',
    [OlfactiveFamily.GREEN]: 'rgba(34, 197, 94, 0.7)',
    [OlfactiveFamily.FRUITY]: 'rgba(126, 34, 206, 0.7)',
    [OlfactiveFamily.GOURMAND]: 'rgba(120, 113, 108, 0.7)',
    [OlfactiveFamily.AMBER]: 'rgba(217, 119, 6, 0.7)',
    [OlfactiveFamily.MUSK]: 'rgba(196, 181, 253, 0.7)',
    [OlfactiveFamily.AQUATIC]: 'rgba(96, 165, 250, 0.7)',
    [OlfactiveFamily.AROMATIC]: 'rgba(20, 184, 166, 0.7)',
    [OlfactiveFamily.BALSAMIC]: 'rgba(120, 53, 15, 0.7)',
    [OlfactiveFamily.MOSSY]: 'rgba(4, 120, 87, 0.7)',
    [OlfactiveFamily.ALDEHYDIC]: 'rgba(203, 213, 225, 0.7)',
    [OlfactiveFamily.SOLVENT]: 'rgba(107, 114, 128, 0.7)',
    [OlfactiveFamily.ADDITIVE]: 'rgba(71, 85, 105, 0.7)',
};


const FamilyDistributionPolarAreaChart: React.FC<FamilyDistributionPolarAreaChartProps> = ({ familyData, hideLegend = false }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const labels = Object.keys(familyData);
                const data = Object.values(familyData);
                const colors = labels.map(label => familyColors[label as OlfactiveFamily] || 'rgba(156, 163, 175, 0.7)');

                chartInstance.current = new Chart(ctx, {
                    type: 'polarArea',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: colors,
                            borderColor: '#111111',
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                                grid: { color: 'rgba(255, 255, 255, 0.2)' },
                                pointLabels: { color: '#d1d5db', font: { size: 10 } },
                                ticks: {
                                    display: false,
                                    backdropColor: 'transparent',
                                },
                            }
                        },
                        plugins: {
                            legend: {
                                display: !hideLegend,
                                position: 'bottom',
                                labels: {
                                    color: '#d1d5db',
                                    padding: 20,
                                    boxWidth: 15
                                }
                            }
                        }
                    }
                });
            }
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [familyData, hideLegend]);

    return <canvas ref={chartRef}></canvas>;
};

export default React.memo(FamilyDistributionPolarAreaChart);