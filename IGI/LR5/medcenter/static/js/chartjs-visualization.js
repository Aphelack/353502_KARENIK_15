/**
 * Chart.js Visualization - Lab 3, Task 10
 * Visualizes LR3 data: e^x series expansion vs Math.exp(x)
 * Based on task_1.py from IGI LR3
 */

class ChartJSVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }

        this.chart = null;
        this.init();
    }

    init() {
        this.loadChartJS().then(() => {
            this.createInterface();
            this.attachEventListeners();
            this.generateDefaultChart();
        });
    }

    async loadChartJS() {
        // Check if Chart.js is already loaded
        if (typeof Chart !== 'undefined') {
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="chartjs-wrapper">
                <h2>Визуализация с помощью Chart.js</h2>
                <p class="subtitle">Сравнение разложения в ряд e^x и функции Math.exp(x)</p>

                <div class="chart-controls">
                    <div class="control-group">
                        <label for="xMin">X min:</label>
                        <input type="number" id="xMin" value="-2" step="0.1" />
                    </div>

                    <div class="control-group">
                        <label for="xMax">X max:</label>
                        <input type="number" id="xMax" value="2" step="0.1" />
                    </div>

                    <div class="control-group">
                        <label for="xStep">Шаг:</label>
                        <input type="number" id="xStep" value="0.1" step="0.01" min="0.01" />
                    </div>

                    <div class="control-group">
                        <label for="epsilon">Точность (ε):</label>
                        <input type="number" id="epsilon" value="0.000001" step="0.000001" />
                    </div>

                    <button id="btnGenerate" class="btn-generate">
                        Построить график
                    </button>

                    <button id="btnDownload" class="btn-download">
                        💾 Сохранить в файл
                    </button>
                </div>

                <div class="chart-container">
                    <canvas id="seriesChart"></canvas>
                </div>

                <div class="chart-legend">
                    <h3>Легенда и аннотации</h3>
                    <div class="legend-items">
                        <div class="legend-item">
                            <span class="legend-color" style="background: #4a90e2;"></span>
                            <span>Разложение в ряд: e^x = Σ(x^n/n!)</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background: #f44336;"></span>
                            <span>Математическая функция: Math.exp(x)</span>
                        </div>
                    </div>
                    <p class="annotation">
                        <strong>Формула:</strong> e^x = 1 + x + x²/2! + x³/3! + x⁴/4! + ...
                    </p>
                    <p class="annotation">
                        Разложение вычисляется до тех пор, пока очередной член ряда не станет меньше заданной точности ε.
                    </p>
                </div>

                <div class="data-table-container">
                    <h3>Таблица данных</h3>
                    <div id="dataTable"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        document.getElementById('btnGenerate').addEventListener('click', () => {
            this.generateChart();
        });

        document.getElementById('btnDownload').addEventListener('click', () => {
            this.downloadChart();
        });
    }

    // Calculate series expansion e^x = Σ(x^n/n!)
    calculateSeriesExpansion(x, epsilon = 1e-6, maxIter = 500) {
        let sum = 0;
        let term = 1; // First term is 1
        let n = 0;

        for (let i = 0; i < maxIter; i++) {
            sum += term;

            if (Math.abs(term) < epsilon) {
                break;
            }

            n++;
            term *= x / n;
        }

        return { sum, iterations: n };
    }

    generateDefaultChart() {
        this.generateChart();
    }

    generateChart() {
        const xMin = parseFloat(document.getElementById('xMin').value);
        const xMax = parseFloat(document.getElementById('xMax').value);
        const xStep = parseFloat(document.getElementById('xStep').value);
        const epsilon = parseFloat(document.getElementById('epsilon').value);

        // Generate data points
        const xValues = [];
        const seriesValues = [];
        const mathValues = [];
        const tableData = [];

        for (let x = xMin; x <= xMax; x += xStep) {
            xValues.push(x.toFixed(2));
            
            const seriesResult = this.calculateSeriesExpansion(x, epsilon);
            const mathResult = Math.exp(x);

            seriesValues.push(seriesResult.sum);
            mathValues.push(mathResult);

            tableData.push({
                x: x.toFixed(4),
                series: seriesResult.sum.toFixed(8),
                math: mathResult.toFixed(8),
                iterations: seriesResult.iterations,
                error: Math.abs(seriesResult.sum - mathResult).toExponential(2)
            });
        }

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        // Create new chart
        const ctx = document.getElementById('seriesChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [
                    {
                        label: 'Разложение в ряд (Σ x^n/n!)',
                        data: seriesValues,
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 3,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.4
                    },
                    {
                        label: 'Math.exp(x)',
                        data: mathValues,
                        borderColor: '#f44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        borderWidth: 3,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.4,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Сравнение e^x: Разложение в ряд vs Math.exp()',
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y.toFixed(6);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'x',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'e^x',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        // Update data table
        this.updateDataTable(tableData);
    }

    updateDataTable(data) {
        const tableContainer = document.getElementById('dataTable');
        
        let html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>x</th>
                        <th>Разложение в ряд</th>
                        <th>Math.exp(x)</th>
                        <th>Итерации</th>
                        <th>Погрешность</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            html += `
                <tr>
                    <td>${row.x}</td>
                    <td>${row.series}</td>
                    <td>${row.math}</td>
                    <td>${row.iterations}</td>
                    <td>${row.error}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;
    }

    downloadChart() {
        if (!this.chart) {
            alert('Сначала постройте график');
            return;
        }

        const canvas = document.getElementById('seriesChart');
        const url = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = 'chart_exp_series.png';
        link.href = url;
        link.click();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('chartContainer')) {
            window.chartVisualization = new ChartJSVisualization('chartContainer');
        }
    });
} else {
    if (document.getElementById('chartContainer')) {
        window.chartVisualization = new ChartJSVisualization('chartContainer');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartJSVisualization;
}
