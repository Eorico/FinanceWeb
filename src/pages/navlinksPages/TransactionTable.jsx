import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUpDown, Calendar, DollarSign, Tag } from 'lucide-react';

function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'amount') {
        aValue = Math.abs(aValue);
        bValue = Math.abs(bValue);
      }
      
      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Income': '💰',
      'Food': '🍽️',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Housing': '🏠',
      'Utilities': '⚡'
    };
    return icons[category] || '📝';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <section className="transactions-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Transaction History</h2>
          <p className="section-subtitle">Track all your financial activities</p>
        </div>
        <button className="export-btn">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="transaction-summary">
        <div className="summary-card income">
          <div className="summary-icon">
            <DollarSign size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Income</span>
            <span className="summary-value positive">+${totalIncome.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card expense">
          <div className="summary-icon">
            <DollarSign size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Expenses</span>
            <span className="summary-value negative">-${totalExpenses.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card net">
          <div className="summary-icon">
            <DollarSign size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Net Income</span>
            <span className={`summary-value ${(totalIncome - totalExpenses) >= 0 ? 'positive' : 'negative'}`}>
              ${(totalIncome - totalExpenses).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="transaction-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} className="filter-icon" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} className="sortable">
                <div className="th-content">
                  <Calendar size={16} />
                  Date
                  <ArrowUpDown size={14} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('description')} className="sortable">
                <div className="th-content">
                  Description
                  <ArrowUpDown size={14} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                <div className="th-content">
                  <Tag size={16} />
                  Category
                  <ArrowUpDown size={14} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('amount')} className="sortable">
                <div className="th-content">
                  <DollarSign size={16} />
                  Amount
                  <ArrowUpDown size={14} className="sort-icon" />
                </div>
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="transaction-row">
                <td className="date-cell">
                  {formatDate(transaction.date)}
                </td>
                <td className="description-cell">
                  <div className="description-content">
                    <span className="category-emoji">{getCategoryIcon(transaction.category)}</span>
                    <span className="description-text">{transaction.description}</span>
                  </div>
                </td>
                <td className="category-cell">
                  <span className={`category-badge ${transaction.type}`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="amount-cell">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${transaction.status}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="empty-state">
          <p>No transactions found matching your criteria.</p>
        </div>
      )}
    </section>
  );
}

export default TransactionsTable;