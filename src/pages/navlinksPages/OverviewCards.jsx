import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, PiggyBank } from 'lucide-react';
import { useFinancial } from '../../components/context/FinancialContext';

function OverviewCards() {
  const { getOverviewData } = useFinancial();
  const overviewData = getOverviewData();

  const cards = [
    {
      title: 'Total Balance',
      value: `$${overviewData.totalBalance.toLocaleString()}`,
      change: '+2.5%',
      trend: overviewData.totalBalance >= 0 ? 'up' : 'down',
      icon: Wallet,
      color: 'blue',
      description: 'vs last month'
    },
    {
      title: 'Income This Month',
      value: `$${overviewData.monthlyIncome.toLocaleString()}`,
      change: '+12.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      description: 'vs last month'
    },
    {
      title: 'Expenses This Month',
      value: `$${overviewData.monthlyExpenses.toLocaleString()}`,
      change: '-5.2%',
      trend: 'down',
      icon: CreditCard,
      color: 'red',
      description: 'vs last month'
    },
    {
      title: 'Savings Goal',
      value: `$${overviewData.savingsGoalProgress.toLocaleString()}`,
      change: `${((overviewData.savingsGoalProgress / overviewData.savingsGoalTarget) * 100).toFixed(1)}%`,
      trend: 'up',
      icon: PiggyBank,
      color: 'purple',
      description: `of $${overviewData.savingsGoalTarget.toLocaleString()} goal`
    }
  ];

  const getColorClass = (color) => {
    return `card-icon-${color}`;
  };

  const getTrendClass = (trend) => {
    return trend === 'up' ? 'trend-positive' : 'trend-negative';
  };

  return (
    <section className="overview-section">
      <div className="section-header">
        <h2 className="section-title">Financial Overview</h2>
        <p className="section-subtitle">Track your financial health at a glance</p>
      </div>
      
      <div className="overview-grid">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="overview-card">
              <div className="card-header">
                <div className={`card-icon ${getColorClass(card.color)}`}>
                  <Icon size={24} />
                </div>
                <div className={`trend-indicator ${getTrendClass(card.trend)}`}>
                  <TrendIcon size={16} />
                  <span className="trend-value">{card.change}</span>
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-value">{card.value}</p>
                <p className="card-description">{card.description}</p>
              </div>
              
              <div className="card-footer">
                <div className="progress-indicator">
                  <div className={`progress-bar progress-${card.color}`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Summary Stats */}
      <div className="additional-stats">
        <div className="stat-item">
          <span className="stat-label">Budget Utilization</span>
          <span className="stat-value">
            {overviewData.totalBudget > 0 
              ? `${((overviewData.totalSpent / overviewData.totalBudget) * 100).toFixed(1)}%`
              : '0%'
            }
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Savings Rate</span>
          <span className="stat-value">{overviewData.savingsRate}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Budget Remaining</span>
          <span className="stat-value">${overviewData.budgetRemaining.toLocaleString()}</span>
        </div>
      </div>
    </section>
  );
}

export default OverviewCards;