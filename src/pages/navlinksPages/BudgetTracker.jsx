import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Plus, Minus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useFinancial } from './FinancialContext';

function BudgetTracker() {
  const { budgets, addBudget, updateBudget, deleteBudget, updateBudgetSpending } = useFinancial();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', budget: '', color: 'blue' });
  const [editingBudget, setEditingBudget] = useState(null);
  const [editForm, setEditForm] = useState({ category: '', budget: '', color: 'blue' });

  const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgets.reduce((sum, item) => sum + item.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getPercentage = (spent, budget) => Math.min((spent / budget) * 100, 100);
  
  const getStatusIcon = (spent, budget) => {
    const percentage = getPercentage(spent, budget);
    if (percentage >= 100) return <AlertTriangle size={16} className="text-red-500" />;
    if (percentage >= 80) return <AlertTriangle size={16} className="text-yellow-500" />;
    return <CheckCircle size={16} className="text-green-500" />;
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newBudget.category && newBudget.budget) {
      addBudget(newBudget);
      setNewBudget({ category: '', budget: '', color: 'blue' });
      setShowAddForm(false);
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget.id);
    setEditForm({
      category: budget.category,
      budget: budget.budget.toString(),
      color: budget.color
    });
  };

  const handleSaveEdit = (budgetId) => {
    if (editForm.category && editForm.budget) {
      updateBudget(budgetId, {
        category: editForm.category,
        budget: parseFloat(editForm.budget),
        color: editForm.color
      });
      setEditingBudget(null);
      setEditForm({ category: '', budget: '', color: 'blue' });
    }
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setEditForm({ category: '', budget: '', color: 'blue' });
  };

  const handleDeleteBudget = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget category?')) {
      deleteBudget(budgetId);
    }
  };

  const adjustSpending = (id, amount) => {
    updateBudgetSpending(id, amount);
  };

  return (
    <section className="budget-tracker">
      <div className="section-header">
        <div>
          <h2 className="section-title">Budget Tracker</h2>
          <p className="section-subtitle">Monitor your spending across categories</p>
        </div>
        <button 
          className="add-budget-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Overall Budget Summary */}
      <div className="budget-summary">
        <div className="summary-header">
          <div className="summary-icon">
            <Target size={24} />
          </div>
          <div className="summary-content">
            <h3>Overall Budget</h3>
            <div className="summary-amounts">
              <span className="total-budget">${totalBudget.toLocaleString()}</span>
              <span className="spent-amount">${totalSpent.toLocaleString()} spent</span>
            </div>
          </div>
          <div className="summary-percentage">
            <span className={`percentage ${overallPercentage >= 90 ? 'danger' : overallPercentage >= 70 ? 'warning' : 'safe'}`}>
              {overallPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overall-progress">
          <div 
            className={`progress-fill ${overallPercentage >= 90 ? 'danger' : overallPercentage >= 70 ? 'warning' : 'safe'}`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className="add-budget-form">
          <form onSubmit={handleAddBudget}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Category name"
                value={newBudget.category}
                onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                className="category-input"
              />
              <input
                type="number"
                placeholder="Budget amount"
                value={newBudget.budget}
                onChange={(e) => setNewBudget({...newBudget, budget: e.target.value})}
                className="budget-input"
              />
              <select
                value={newBudget.color}
                onChange={(e) => setNewBudget({...newBudget, color: e.target.value})}
                className="color-select"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
              </select>
              <button type="submit" className="submit-budget-btn">Add</button>
              <button 
                type="button" 
                className="cancel-budget-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Categories */}
      <div className="budget-categories">
        {budgets.map((budget) => {
          const percentage = getPercentage(budget.spent, budget.budget);
          const remaining = budget.budget - budget.spent;
          const isEditing = editingBudget === budget.id;
          
          return (
            <div key={budget.id} className="budget-item">
              <div className="budget-header">
                <div className="category-info">
                  {isEditing ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="edit-category-input"
                      />
                      <input
                        type="number"
                        value={editForm.budget}
                        onChange={(e) => setEditForm({...editForm, budget: e.target.value})}
                        className="edit-budget-input"
                      />
                      <select
                        value={editForm.color}
                        onChange={(e) => setEditForm({...editForm, color: e.target.value})}
                        className="edit-color-select"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="purple">Purple</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <h4 className="category-name">{budget.category}</h4>
                      <div className="budget-amounts">
                        <span className="spent">${budget.spent.toLocaleString()}</span>
                        <span className="separator">of</span>
                        <span className="total">${budget.budget.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="budget-status">
                  {isEditing ? (
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleSaveEdit(budget.id)}
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
                    <>
                      {getStatusIcon(budget.spent, budget.budget)}
                      <span className={`percentage ${percentage >= 100 ? 'over-budget' : percentage >= 80 ? 'warning' : 'on-track'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <>
                  <div className="progress-container">
                    <div className="progress-track">
                      <div 
                        className={`progress-bar progress-${budget.color} ${percentage >= 100 ? 'over-budget' : ''}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="budget-footer">
                    <div className="remaining-amount">
                      {remaining >= 0 ? (
                        <span className="remaining-positive">${remaining.toLocaleString()} remaining</span>
                      ) : (
                        <span className="remaining-negative">${Math.abs(remaining).toLocaleString()} over budget</span>
                      )}
                    </div>
                    <div className="budget-controls">
                      <button 
                        className="adjust-btn decrease"
                        onClick={() => adjustSpending(budget.id, -50)}
                        title="Decrease spending by $50"
                      >
                        <Minus size={14} />
                      </button>
                      <button 
                        className="adjust-btn increase"
                        onClick={() => adjustSpending(budget.id, 50)}
                        title="Increase spending by $50"
                      >
                        <Plus size={14} />
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditBudget(budget)}
                        title="Edit budget"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteBudget(budget.id)}
                        title="Delete budget"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BudgetTracker;