import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/todo.css";

const Todo = () => {
  const { user, authToken } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/v1/todos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        setTodos(data);
        setError(null);
      } catch (err) {
        setError("Error fetching todos. Please try again later.");
        console.error("Error fetching todos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTodos();
    }
  }, [user, authToken]);

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.trim()) return;
    console.log(user.id);
    try {
      const response = await fetch("http://localhost:8000/api/v1/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title: newTodo,
          description: newDescription,
          completed: false,
          id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const addedTodo = await response.json();
      setTodos([...todos, addedTodo]);
      setNewTodo("");
      setNewDescription("");
      setError(null);
    } catch (err) {
      setError("Error adding todo. Please try again.");
      console.error("Error adding todo:", err);
    }
  };

  // Toggle todo completion status
  const handleToggleTodo = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const updatedStatus = !todoToUpdate.completed;

      const response = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ completed: updatedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedStatus } : todo
        )
      );
      setError(null);
    } catch (err) {
      setError("Error updating todo. Please try again.");
      console.error("Error updating todo:", err);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      setError("Error deleting todo. Please try again.");
      console.error("Error deleting todo:", err);
    }
  };

  if (!user) {
    return (
      <div className="todo-container">Please log in to manage your todos.</div>
    );
  }

  return (
    <div className="todo-container">
      <h2>My Todo List</h2>

      {error && <div className="todo-error">{error}</div>}

      <form onSubmit={handleAddTodo} className="todo-form">
        <div className="todo-form-group">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
            required
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="todo-textarea"
            rows="2"
          />
        </div>
        <button type="submit" className="todo-add-btn">
          Add
        </button>
      </form>

      {loading ? (
        <div className="todo-loading">Loading todos...</div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="todo-empty">No todos yet. Add one above!</li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-content">
                  <div className="todo-header">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <span className="todo-text">{todo.title}</span>
                  </div>
                  {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="todo-delete-btn"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Todo;
