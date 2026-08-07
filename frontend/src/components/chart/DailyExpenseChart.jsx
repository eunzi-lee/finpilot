import { Line } from 'react-chartjs-2'

function formatCurrency(amount) {
    return `${new Intl.NumberFormat('ko-KR').format(amount)}원`
}

function formatYAxisValue(value) {
    if (value === 0) {
        return '0'
    }

    if (value >= 10000) {
        const convertedValue = value / 10000

        return Number.isInteger(convertedValue)
            ? `${convertedValue}만`
            : `${convertedValue.toFixed(1)}만`
    }

    return new Intl.NumberFormat('ko-KR').format(value)
}

function DailyExpenseChart({
    dailyExpenseData,
    selectedMonthText,
}) {
    const hasExpenseData = dailyExpenseData.some(
        (item) => item.amount > 0,
    )

    const chartData = {
        labels: dailyExpenseData.map(
            (item) => item.label,
        ),
        datasets: [
            {
                label: '일별 지출',
                data: dailyExpenseData.map(
                    (item) => item.amount,
                ),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#2563eb',
                pointBorderWidth: 2,
                pointRadius: (context) =>
                    context.raw > 0 ? 3 : 0,
                pointHoverRadius: 6,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                displayColors: false,
                padding: 12,
                callbacks: {
                    title: (items) =>
                        `${selectedMonthText} ${items[0].label}`,
                    label: (context) =>
                        `지출 ${formatCurrency(context.parsed.y)}`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 10,
                    },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 8,
                },
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false,
                },
                grid: {
                    color: '#e2e8f0',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 10,
                    },
                    callback: formatYAxisValue,
                },
            },
        },
    }

    return (
        <article className="chart-card">
            <div className="chart-card-header">
                <div>
                    <span className="dashboard-card-label">
                        DAILY EXPENSE
                    </span>

                    <h2>일별 지출 추이</h2>
                </div>

                <span className="chart-period-badge">
                    {selectedMonthText}
                </span>
            </div>

            <div className="line-chart-container">
                {hasExpenseData ? (
                    <Line
                        data={chartData}
                        options={chartOptions}
                    />
                ) : (
                    <div className="chart-empty-state">
                        <span>⌁</span>
                        <strong>
                            일별 지출 데이터가 없습니다
                        </strong>
                        <p>
                            지출을 등록하면 날짜별 소비 흐름이
                            표시됩니다.
                        </p>
                    </div>
                )}
            </div>
        </article>
    )
}

export default DailyExpenseChart