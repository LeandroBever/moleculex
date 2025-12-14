
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Chart } from 'chart.js/auto';

interface EvaporationCurveLineChartProps {
    data: number[];
}

const EvaporationCurveLineChart: React.FC<EvaporationCurveLineChartProps> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

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
                        labels: data.map((_, i) => `T${i}`), // Simplified time labels
                        datasets: [{
                            label: 'Strength',
                            data: data,
                            fill: true,
                            backgroundColor: 'rgba(168, 153, 132, 0.2)',
                            borderColor: 'rgba(168, 153, 132, 1)',
                            tension: 0.4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                           y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                ticks: { color: '#9ca3af' }
                            },
                            x: {
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                ticks: { color: '#9ca3af' }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
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
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

export default React.memo(EvaporationCurveLineChart);
