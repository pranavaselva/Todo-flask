// Todo.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5001/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!newTodo) return;
    try {
      await axios.post('http://localhost:5001/todos', { title: newTodo });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  // Update todo (toggle completed)
  const toggleComplete = async (id, currentStatus) => {
    try {
      const todo = todos.find(t => t.id === id);
      await axios.put(`http://localhost:5001/todos/${id}`, {
        title: todo.title,
        completed: !currentStatus
      });
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div
      style={{
        margin: '50px',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '20px',
        backgroundColor: 'black', // Black background
        borderRadius: '10px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', marginTop: '50px', color: 'white' }}>Todo App</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            style={{
              width: '80%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              color: 'black', // Input text color
              backgroundColor: 'white', // Input background color
            }}
          />
          <button
            onClick={addTodo}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Add
          </button>
        </div>
      </div>

      <ul style={{ listStyle: 'none', paddingLeft: 0, color: 'white' }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#333', // Dark background for each todo item
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <span
              onClick={() => toggleComplete(todo.id, todo.completed)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
                fontSize: '16px',
                width: '80%',
                color: 'white', // Text color for todos
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '5px',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
