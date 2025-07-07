import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUpDown, Calendar, DollarSign, Tag, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useFinancial } from '../../components/context/FinancialContext';

function TransactionsTable() {
  const { transactions, budgets, addTransaction, updateTransaction, deleteTransaction, exportToExcel } = useFinancial();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: '',
    type: 'expense'
  });
  const [editForm, setEditForm] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    type: 'expense'
  });

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

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (newTransaction.description && newTransaction.category && newTransaction.amount) {
      const amount = newTransaction.type === 'expense' 
        ? -Math.abs(parseFloat(newTransaction.amount))
        : Math.abs(parseFloat(newTransaction.amount));
      
      addTransaction({
        ...newTransaction,
        amount: amount
      });
      
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: '',
        type: 'expense'
      });
      setShowAddForm(false);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction.id);
    setEditForm({
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.type
    });
  };

  const handleSaveEdit = (transactionId) => {
    if (editForm.description && editForm.category && editForm.amount) {
      const amount = editForm.type === 'expense' 
        ? -Math.abs(parseFloat(editForm.amount))
        : Math.abs(parseFloat(editForm.amount));
      
      updateTransaction(transactionId, {
        ...editForm,
        amount: amount
      });
      
      setEditingTransaction(null);
      setEditForm({
        date: '',
        description: '',
        category: '',
        amount: '',
        type: 'expense'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setEditForm({
      date: '',
      description: '',
      category: '',
      amount: '',
      type: 'expense'
    });
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transactionId);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Income': '💰',
      'Food & Dining': '🍽️',
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
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const categoryOptions = ['Income', ...budgets.map(b => b.category)];

  return (
    <section className="transactions-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Transaction History</h2>
          <p className="section-subtitle">Track all your financial activities</p>
        </div>
        <div className="header-actions">
          <button 
            className="add-transaction-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={20} />
            Add Transaction
          </button>
          <button className="export-btn" onClick={exportToExcel}>
            <Download size={20} />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div className="add-transaction-form">
          <form onSubmit={handleAddTransaction}>
            <div className="form-row">
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                className="date-input"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="description-input"
              />
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                className="category-select"
              >
                <option value="">Select Category</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                className="amount-input"
              />
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                className="type-select"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <button type="submit" className="submit-transaction-btn">Add</button>
              <button 
                type="button" 
                className="cancel-transaction-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => {
              const isEditing = editingTransaction === transaction.id;
              
              return (
                <tr key={transaction.id} className="transaction-row">
                  <td className="date-cell">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                        className="edit-date-input"
                      />
                    ) : (
                      formatDate(transaction.date)
                    )}
                  </td>
                  <td className="description-cell">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="edit-description-input"
                      />
                    ) : (
                      <div className="description-content">
                        <span className="category-emoji">{getCategoryIcon(transaction.category)}</span>
                        <span className="description-text">{transaction.description}</span>
                      </div>
                    )}
                  </td>
                  <td className="category-cell">
                    {isEditing ? (
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="edit-category-select"
                      >
                        {categoryOptions.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`category-badge ${transaction.type}`}>
                        {transaction.category}
                      </span>
                    )}
                  </td>
                  <td className="amount-cell">
                    {isEditing ? (
                      <div className="edit-amount-container">
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                          className="edit-amount-input"
                        />
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                          className="edit-type-select"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                    ) : (
                      <span className={`amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {isEditing ? (
                      <div className="edit-actions">
                        <button 
                          className="save-btn"
                          onClick={() => handleSaveEdit(transaction.id)}
                        >
                          <Save size={14} />
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="transaction-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditTransaction(transaction)}
                          title="Edit transaction"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          title="Delete transaction"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
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