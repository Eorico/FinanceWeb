import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, PiggyBank } from 'lucide-react';

function OverviewCards() {
  const cards = [
    {
      title: 'Total Balance',
      value: '$5,247.83',
      change: '+2.5%',
      trend: 'up',
      icon: Wallet,
      color: 'blue',
      description: 'vs last month'
    },
    {
      title: 'Income This Month',
      value: '$3,200.00',
      change: '+12.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      description: 'vs last month'
    },
    {
      title: 'Expenses This Month',
      value: '$1,847.25',
      change: '-5.2%',
      trend: 'down',
      icon: CreditCard,
      color: 'red',
      description: 'vs last month'
    },
    {
      title: 'Savings Goal',
      value: '$1,352.58',
      change: '67.6%',
      trend: 'up',
      icon: PiggyBank,
      color: 'purple',
      description: 'of $2,000 goal'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
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
                <div className={`card-icon ${getColorClasses(card.color)}`}>
                  <Icon size={24} />
                </div>
                <div className={`trend-indicator ${getTrendColor(card.trend)}`}>
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
    </section>
  );
}

export default OverviewCards;