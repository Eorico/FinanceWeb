import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, DollarSign, Target, AlertCircle } from 'lucide-react';
import { useFinancial } from '../../components/context/FinancialContext';

function Analytics() {
  const { getAnalyticsData, financialGoals } = useFinancial();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const analyticsData = getAnalyticsData();
  const { 
    totalIncome, 
    totalExpenses, 
    totalSavings, 
    savingsRate, 
    categoryBreakdown, 
    spendingTrends,
    totalBudgetAmount,
    totalBudgetSpent 
  } = analyticsData;

  const insights = [
    {
      type: totalExpenses < (totalIncome * 0.8) ? 'positive' : 'warning',
      icon: TrendingUp,
      title: 'Spending Analysis',
      description: totalExpenses < (totalIncome * 0.8) 
        ? 'Your expenses are well controlled' 
        : 'Consider reducing expenses',
      value: `$${totalExpenses.toLocaleString()}`
    },
    {
      type: totalBudgetSpent > totalBudgetAmount ? 'warning' : 'positive',
      icon: AlertCircle,
      title: 'Budget Status',
      description: totalBudgetSpent > totalBudgetAmount 
        ? 'Over budget this month' 
        : 'Within budget limits',
      value: totalBudgetAmount > 0 
        ? `${((totalBudgetSpent / totalBudgetAmount) * 100).toFixed(1)}%`
        : '0%'
    },
    {
      type: 'positive',
      icon: Target,
      title: 'Savings Goal',
      description: 'Progress towards emergency fund',
      value: financialGoals[0] ? `${financialGoals[0].percentage}%` : '0%'
    },
    {
      type: parseFloat(savingsRate) >= 20 ? 'positive' : 'warning',
      icon: BarChart3,
      title: 'Savings Rate',
      description: parseFloat(savingsRate) >= 20 
        ? 'Excellent savings rate!' 
        : 'Try to save more',
      value: `${savingsRate}%`
    }
  ];

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const calculateTrend = (data, field) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1][field];
    const previous = data[data.length - 2][field];
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <section className="analytics-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Financial Analytics</h2>
          <p className="section-subtitle">Insights into your financial patterns and trends</p>
        </div>
        <div className="analytics-controls">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Insights */}
      <div className="insights-grid">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className={`insight-card ${getInsightColor(insight.type)}`}>
              <div className="insight-header">
                <Icon size={20} />
                <span className="insight-value">{insight.value}</span>
              </div>
              <h4 className="insight-title">{insight.title}</h4>
              <p className="insight-description">{insight.description}</p>
            </div>
          );
        })}
      </div>

      {/* Financial Overview */}
      <div className="analytics-grid">
        {/* Spending Trends Chart */}
        <div className="analytics-card large">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Spending Trends
            </h3>
            <div className="trend-indicators">
              <span className="trend-item">
                <span className="trend-label">Income</span>
                <span className="trend-value positive">+{calculateTrend(spendingTrends, 'income')}%</span>
              </span>
              <span className="trend-item">
                <span className="trend-label">Expenses</span>
                <span className="trend-value negative">{calculateTrend(spendingTrends, 'expenses')}%</span>
              </span>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color income"></div>
                <span>Income</span>
              </div>
              <div className="legend-item">
                <div className="legend-color expenses"></div>
                <span>Expenses</span>
              </div>
              <div className="legend-item">
                <div className="legend-color savings"></div>
                <span>Savings</span>
              </div>
            </div>
            <div className="bar-chart">
              {spendingTrends.map((data, index) => {
                const maxValue = Math.max(...spendingTrends.map(d => Math.max(d.income, d.expenses)));
                return (
                  <div key={index} className="chart-bar-group">
                    <div className="chart-bars">
                      <div 
                        className="chart-bar income"
                        style={{ height: `${(data.income / maxValue) * 100}%` }}
                        title={`Income: $${data.income}`}
                      ></div>
                      <div 
                        className="chart-bar expenses"
                        style={{ height: `${(data.expenses / maxValue) * 100}%` }}
                        title={`Expenses: $${data.expenses}`}
                      ></div>
                      <div 
                        className="chart-bar savings"
                        style={{ height: `${Math.abs(data.savings) / maxValue * 100}%` }}
                        title={`Savings: $${data.savings}`}
                      ></div>
                    </div>
                    <span className="chart-label">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">
              <PieChart size={20} />
              Spending by Category
            </h3>
          </div>
          <div className="category-breakdown">
            {categoryBreakdown.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <div 
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="category-name">{category.category}</span>
                </div>
                <div className="category-stats">
                  <span className="category-amount">${category.amount.toLocaleString()}</span>
                  <span className="category-percentage">{category.percentage}%</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-progress"
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Goals and Summary */}
      <div className="analytics-grid">
        {/* Financial Goals */}
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">
              <Target size={20} />
              Financial Goals Progress
            </h3>
          </div>
          <div className="goals-list">
            {financialGoals.map((goal, index) => (
              <div key={index} className="goal-item">
                <div className="goal-header">
                  <span className="goal-name">{goal.goal}</span>
                  <span className="goal-progress">{goal.percentage}%</span>
                </div>
                <div className="goal-amounts">
                  <span className="goal-current">${goal.current.toLocaleString()}</span>
                  <span className="goal-target">of ${goal.target.toLocaleString()}</span>
                </div>
                <div className="goal-bar">
                  <div 
                    className="goal-progress-fill"
                    style={{ width: `${goal.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">
              <DollarSign size={20} />
              Financial Summary
            </h3>
          </div>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Income</span>
              <span className="summary-value positive">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Expenses</span>
              <span className="summary-value negative">${totalExpenses.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Savings</span>
              <span className="summary-value neutral">${totalSavings.toLocaleString()}</span>
            </div>
            <div className="summary-item highlight">
              <span className="summary-label">Savings Rate</span>
              <span className="summary-value positive">{savingsRate}%</span>
            </div>
          </div>
          
          <div className="summary-insights">
            <h4>Key Insights</h4>
            <ul>
              <li>Your savings rate is {parseFloat(savingsRate) >= 20 ? 'above' : 'below'} the recommended 20%</li>
              <li>{categoryBreakdown[0]?.category || 'No category'} is your largest expense category</li>
              <li>Budget utilization: {totalBudgetAmount > 0 ? `${((totalBudgetSpent / totalBudgetAmount) * 100).toFixed(1)}%` : '0%'}</li>
              <li>{financialGoals[0]?.goal || 'Emergency fund'} goal is {financialGoals[0]?.percentage || 0}% complete</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Analytics;