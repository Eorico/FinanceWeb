import React, { useState } from 'react';
import { Plus, Check, X, Calendar, Flag, Search, Filter } from 'lucide-react';

function TodoList() {
  const [todos, setTodos] = useState([]);

  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState('Finance');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const categories = ['Finance', 'Bills', 'Savings', 'Investment', 'Personal', 'Work'];

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        task: newTask.trim(), 
        completed: false,
        priority: newPriority,
        dueDate: newDueDate,
        category: newCategory
      }]);
      setNewTask('');
      setNewDueDate('');
    }
  };

  const handleToggle = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ));
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && todo.completed) ||
                         (filterStatus === 'pending' && !todo.completed);
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return colors[priority] || 'priority-medium';
  };

  const getPriorityIcon = (priority) => {
    return <Flag size={14} className={getPriorityColor(priority)} />;
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <section className="todo-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Financial To-Do List</h2>
          <p className="section-subtitle">Stay on top of your financial tasks</p>
        </div>
        <div className="completion-stats">
          <span className="completion-text">{completedCount} of {totalCount} completed</span>
          <div className="completion-bar">
            <div 
              className="completion-progress" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add New Task Form */}
      <div className="add-task-form">
        <form onSubmit={handleAdd} className="task-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Add a new financial task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
              required
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="date-input"
              min={new Date().toISOString().split('T')[0]}
            />
            <button type="submit" className="add-task-btn">
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="todo-controls">
        <div className="search-container">
          <Search size={20} className="search-icon-todo" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-main">
              <button
                className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => handleToggle(todo.id)}
              >
                {todo.completed && <Check size={16} />}
              </button>
              
              <div className="todo-content">
                <div className="todo-text">
                  <span className={`task-text ${todo.completed ? 'completed-text' : ''}`}>
                    {todo.task}
                  </span>
                  <div className="todo-meta">
                    <span className={`category-tag ${todo.category.toLowerCase()}`}>
                      {todo.category}
                    </span>
                    {todo.dueDate && (
                      <span className={`due-date ${isOverdue(todo.dueDate) ? 'overdue' : isDueToday(todo.dueDate) ? 'due-today' : ''}`}>
                        <Calendar size={12} />
                        {formatDate(todo.dueDate)}
                        {isOverdue(todo.dueDate) && ' (Overdue)'}
                        {isDueToday(todo.dueDate) && ' (Due Today)'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="todo-actions">
                  <div className="priority-indicator">
                    {getPriorityIcon(todo.priority)}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(todo.id)}
                    title="Delete task"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="empty-state">
          <p>No tasks found. {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' ? 'Try adjusting your filters.' : 'Add your first financial task above!'}</p>
        </div>
      )}
    </section>
  );
}

export default TodoList;