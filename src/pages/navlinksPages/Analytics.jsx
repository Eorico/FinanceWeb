import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, DollarSign, Target, AlertCircle } from 'lucide-react';

function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data - in a real app, this would come from your backend
  const spendingTrends = [];

  const categoryBreakdown = [];

  const financialGoals = [];

  const insights = [
    {
      type: 'positive',
      icon: TrendingUp,
      title: 'Spending Decreased',
      description: 'Your expenses are 15% lower than last month',
      value: '-$320'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Budget Alert',
      description: 'Food & Dining is 20% over budget',
      value: '+$104'
    },
    {
      type: 'positive',
      icon: Target,
      title: 'Savings Goal',
      description: 'On track to meet emergency fund goal',
      value: '65%'
    },
    {
      type: 'neutral',
      icon: BarChart3,
      title: 'Average Monthly',
      description: 'Your average monthly savings rate',
      value: '22%'
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

  const totalIncome = spendingTrends.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = spendingTrends.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavings = spendingTrends.reduce((sum, item) => sum + item.savings, 0);
  const savingsRate = ((totalSavings / totalIncome) * 100).toFixed(1);

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
                const maxValue = Math.max(...spendingTrends.map(d => d.income));
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
                        style={{ height: `${(data.savings / maxValue) * 100}%` }}
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
                  <span className="category-amount">${category.amount}</span>
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
              <span className="summary-label">Total Income (6 months)</span>
              <span className="summary-value positive">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Expenses (6 months)</span>
              <span className="summary-value negative">${totalExpenses.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Savings (6 months)</span>
              <span className="summary-value neutral">${totalSavings.toLocaleString()}</span>
            </div>
            <div className="summary-item highlight">
              <span className="summary-label">Average Savings Rate</span>
              <span className="summary-value positive">{savingsRate}%</span>
            </div>
          </div>
          
          <div className="summary-insights">
            <h4>Key Insights</h4>
            <ul>
              <li>Your savings rate is above the recommended 20%</li>
              <li>Food & Dining is your largest expense category</li>
              <li>Income has been consistent over the past 6 months</li>
              <li>Emergency fund goal is 65% complete</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Analytics;