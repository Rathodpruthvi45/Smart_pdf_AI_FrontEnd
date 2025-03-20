import React from "react";
import Todo from "../components/Todo";

const TodoPage = () => {
  return (
    <div className="todo-page-container">
      <div className="todo-page-header">
        <h1>Todo List</h1>
        <p>Manage your tasks and stay organized</p>
      </div>
      <Todo />
    </div>
  );
};

export default TodoPage;
