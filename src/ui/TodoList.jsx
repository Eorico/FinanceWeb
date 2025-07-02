import { useState } from "react";

function TodoList() {
    const [todo, setTodos] = useState([
        { id: 1, task: 'Review monthly budget',  completed: false  },
        { id: 2, task: 'Pay credit card bill',  completed: true  }
    ]);

    const [newTask, setNewTask] = useState('');
    
    const handleAdd = () => {
        if (newTask.trim()) {
            setTodos([...todo, { id: Date.now(), task: newTask, completed: false }]);
        }
    };

    const handleToggle = (id) => {
        setTodos(todo.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        ));
    };

    return (
    <section className="budget-card">
      <h4>To-Do List</h4>
      <div className="form-group">
        <input
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full"
        />
      </div>
      <button onClick={handleAdd} className="submit-btn">
        Add Task
      </button>

      <ul style={{ marginTop: '15px' }}>
        {todo.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
              />
              <span style={{ marginLeft: '10px', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.task}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
    );
}

export default TodoList;