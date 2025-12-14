
import React, { useEffect, useRef, useMemo } from 'react';
// @ts-ignore
import { Chart } from 'chart.js/auto';
import { Formula, Molecule } from '../../types';

interface FormulaEvaporationChartProps {
    formula: Formula;
    molecules: Molecule[];
}

const FormulaEvaporationChart: React.FC<FormulaEvaporationChartProps> = ({ formula, molecules }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const chartData = useMemo(() => {
        // Assume standard 6-point curve based on mock data types
        const curveLength = 6;
        const topCurve = new Array(curveLength).fill(0);
        const heartCurve = new Array(curveLength).fill(0);
        const baseCurve = new Array(curveLength).fill(0);

        formula.ingredients.forEach(ing => {
            const molecule = molecules.find(m => m.id === ing.moleculeId);
            if (!molecule || !molecule.evaporationCurve) return;

            // Normalize curve length if necessary, though we assume 6 points for now
            const curve = molecule.evaporationCurve;
            const weight = ing.amount;

            // Helper to add weighted values to a specific curve accumulator
            const addToCurve = (targetCurve: number[], factor: number) => {
                for (let i = 0; i < curveLength; i++) {
                    // Use the molecule's curve value (0-100) * amount in formula
                    targetCurve[i] += (curve[i] || 0) * weight * factor;
                }
            };

            const hasRole = (role: string) => molecule.roles.includes(role);

            if (hasRole('Top Note')) {
                addToCurve(topCurve, 1.0);
            } else if (hasRole('Top-Heart Note')) {
                addToCurve(topCurve, 0.5);
                addToCurve(heartCurve, 0.5);
            } else if (hasRole('Heart Note')) {
                addToCurve(heartCurve, 1.0);
            } else if (hasRole('Heart-Base Note')) {
                addToCurve(heartCurve, 0.5);
                addToCurve(baseCurve, 0.5);
            } else if (hasRole('Base Note')) {
                addToCurve(baseCurve, 1.0);
            }
        });

        return { topCurve, heartCurve, baseCurve };
    }, [formula, molecules]);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        // Simplified time labels representing progression
                        labels: ['Initial', '10m', '30m', '1h', '6h', '24h+'],
                        datasets: [
                            {
                                label: 'Top Notes',
                                data: chartData.topCurve,
                                borderColor: '#FBBF24', // Yellow/Orange
                                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 0,
                                borderWidth: 2,
                            },
                            {
                                label: 'Middle Notes',
                                data: chartData.heartCurve,
                                borderColor: '#4ADE80', // Green
                                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 0,
                                borderWidth: 2,
                            },
                            {
                                label: 'Base Notes',
                                data: chartData.baseCurve,
                                borderColor: '#3B82F6', // Blue
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 0,
                                borderWidth: 2,
                            },
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: { display: false }, // Abstract intensity
                                title: { display: true, text: 'Fragrance Intensity', color: '#6b7280', font: { size: 10 } }
                            },
                            x: {
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: { color: '#9ca3af', font: { size: 10 } },
                                title: { display: true, text: 'Time', color: '#6b7280', font: { size: 10 } }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: '#d1d5db',
                                    usePointStyle: true,
                                    boxWidth: 8,
                                    font: { size: 11 }
                                }
                            },
                            tooltip: {
                                backgroundColor: '#1C1C1C',
                                titleColor: '#fff',
                                bodyColor: '#d1d5db',
                                borderColor: '#333',
                                borderWidth: 1,
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
    }, [chartData]);

    return <canvas ref={chartRef}></canvas>;
};

export default React.memo(FormulaEvaporationChart);
