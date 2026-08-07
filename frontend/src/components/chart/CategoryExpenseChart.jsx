import { Doughnut } from 'react-chartjs-2'

const chartColors = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#f97316',
    '#94a3b8',
]

function formatCurrency(amount) {
    return `${new Intl.NumberFormat('ko-KR').format(amount)}원`
}

function CategoryExpenseChart({
    categoryExpenseData,
    totalExpense,
    selectedMonthText,
}) {
    const hasCategoryData =
        categoryExpenseData.length > 0 &&
        totalExpense > 0

    const chartData = {
        labels: categoryExpenseData.map(
            (item) => item.category,
        ),
        datasets: [
            {
                label: '카테고리별 지출',
                data: categoryExpenseData.map(
                    (item) => item.amount,
                ),
                backgroundColor: chartColors,
                borderWidth: 0,
                spacing: 3,
                hoverOffset: 8,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                padding: 12,
                callbacks: {
                    label: (context) => {
                        const amount = context.parsed

                        const percentage =
                            totalExpense > 0
                                ? (
                                      (amount /
                                          totalExpense) *
                                      100
                                  ).toFixed(1)
                                : 0

                        return `${context.label}: ${formatCurrency(
                            amount,
                        )} (${percentage}%)`
                    },
                },
            },
        },
    }

    return (
        <article className="chart-card">
            <div className="chart-card-header">
                <div>
                    <span className="dashboard-card-label">
                        CATEGORY RATIO
                    </span>

                    <h2>카테고리별 소비 비율</h2>
                </div>

                <span className="chart-period-badge">
                    {selectedMonthText}
                </span>
            </div>

            {hasCategoryData ? (
                <div className="category-chart-content">
                    <div className="doughnut-chart-wrapper">
                        <Doughnut
                            data={chartData}
                            options={chartOptions}
                        />

                        <div className="doughnut-center-content">
                            <span>총지출</span>

                            <strong>
                                {formatCurrency(totalExpense)}
                            </strong>
                        </div>
                    </div>

                    <div className="category-chart-legend">
                        {categoryExpenseData.map(
                            (item, index) => {
                                const percentage =
                                    totalExpense > 0
                                        ? Math.round(
                                              (item.amount /
                                                  totalExpense) *
                                                  100,
                                          )
                                        : 0

                                return (
                                    <div
                                        key={item.category}
                                        className="category-legend-item"
                                    >
                                        <div className="category-legend-name">
                                            <span
                                                className="category-legend-color"
                                                style={{
                                                    backgroundColor:
                                                        chartColors[
                                                            index %
                                                                chartColors.length
                                                        ],
                                                }}
                                            />

                                            <span>
                                                {item.category}
                                            </span>
                                        </div>

                                        <strong>
                                            {percentage}%
                                        </strong>
                                    </div>
                                )
                            },
                        )}
                    </div>
                </div>
            ) : (
                <div className="chart-empty-state doughnut-empty-state">
                    <span>◌</span>
                    <strong>
                        카테고리 지출 데이터가 없습니다
                    </strong>
                    <p>
                        지출을 등록하면 소비 비율이 표시됩니다.
                    </p>
                </div>
            )}
        </article>
    )
}

export default CategoryExpenseChart