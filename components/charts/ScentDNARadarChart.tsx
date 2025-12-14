
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Chart } from 'chart.js/auto';

interface ScentDNARadarChartProps {
    scentDNA: Record<string, number>;
}

const ScentDNARadarChart: React.FC<ScentDNARadarChartProps> = ({ scentDNA }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const labels = Object.keys(scentDNA);
                const data = Object.values(scentDNA);

                // Check if dark mode is active for dynamic coloring
                const isDarkMode = document.documentElement.classList.contains('dark');
                
                const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
                const labelColor = isDarkMode ? '#e5e7eb' : '#1f2937'; // Gray-200 vs Gray-800
                const pointBgColor = '#a89984'; // Primary Gold/Caramel
                
                // Fill color: slightly more opaque for better visibility
                const fillColor = 'rgba(168, 153, 132, 0.5)'; 
                const borderColor = '#a89984';

                chartInstance.current = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Scent DNA',
                            data: data,
                            backgroundColor: fillColor,
                            borderColor: borderColor,
                            borderWidth: 3,
                            pointBackgroundColor: pointBgColor,
                            pointBorderColor: isDarkMode ? '#000' : '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: borderColor,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: { color: gridColor },
                                grid: { color: gridColor, circular: true },
                                pointLabels: { 
                                    color: labelColor, 
                                    font: { size: 11, weight: 'bold' },
                                    backdropColor: 'transparent'
                                },
                                ticks: {
                                    display: false, // Hide internal numbers for cleaner look
                                    stepSize: 1,
                                },
                                suggestedMin: 0,
                                suggestedMax: 5,
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
                                titleColor: isDarkMode ? '#fff' : '#000',
                                bodyColor: isDarkMode ? '#ccc' : '#333',
                                borderColor: borderColor,
                                borderWidth: 1,
                                padding: 10,
                                displayColors: false,
                                callbacks: {
                                    label: (context: any) => `Intensity: ${context.raw}/5`
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
    }, [scentDNA]);

    return <canvas ref={chartRef}></canvas>;
};

export default React.memo(ScentDNARadarChart);
