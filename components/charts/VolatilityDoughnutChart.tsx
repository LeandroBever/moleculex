import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Chart } from 'chart.js/auto';

interface VolatilityDoughnutChartProps {
    volatilityData: { top: number; heart: number; base: number };
    hideLegend?: boolean;
}

const VolatilityDoughnutChart: React.FC<VolatilityDoughnutChartProps> = ({ volatilityData, hideLegend = false }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const data = [volatilityData.top, volatilityData.heart, volatilityData.base];
                chartInstance.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Top Notes', 'Heart Notes', 'Base Notes'],
                        datasets: [{
                            data: data,
                            backgroundColor: ['#6EE7B7', '#FBBF24', '#F87171'],
                            borderColor: '#111111',
                            borderWidth: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                            legend: {
                                display: !hideLegend,
                                position: 'bottom',
                                labels: {
                                    color: '#d1d5db',
                                    padding: 20
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
    }, [volatilityData, hideLegend]);

    return <canvas ref={chartRef}></canvas>;
};

export default React.memo(VolatilityDoughnutChart);