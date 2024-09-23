'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [todoElement, settodoElement] = useState('');  
  const [todoList, settodoList] = useState([]);       
  const [editTodoId, setEditTodoId] = useState(null); 

  // Initialize the todo list from local storage
  const handleDataAddToLocal = () => {
    if (typeof window !== 'undefined' && localStorage) {
      const storedTodos = localStorage.getItem('todo');
      
      // Only set default todos if there's nothing in localStorage
      if (!storedTodos) {
        const data = JSON.stringify([
          { id: 1, text: 'text 1', isChecked: false },
          { id: 2, text: 'text 2', isChecked: false },
        ]);
        localStorage.setItem('todo', data);
        settodoList(JSON.parse(data));
      } else {
        try {
          settodoList(JSON.parse(storedTodos));
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          alert("Error loading todos. Resetting list.");
          localStorage.removeItem('todo');
          settodoList([]); // Reset the list if there's an error
        }
      }
    }
  };
// On mount setting the local sotrage and persit the state
  useEffect(() => {
    handleDataAddToLocal();
  }, []);

  // Add or Edit Todo
  const handelAddTodo = (e) => {
    if (e.key === 'Enter') {
      if (todoElement.trim() === "") {
        alert('Please add a task before pressing Enter!');
        return;
      }

      const todo = JSON.parse(localStorage.getItem('todo')) || [];
      let updatedTodos;

      // Edit Mode
      if (editTodoId) {
        updatedTodos = todo.map(td => td.id === editTodoId ? { ...td, text: todoElement } : td);
        setEditTodoId(null);  // Reset after editing
      } 
      // Add Mode
      else {
        updatedTodos = [...todo, { id: new Date().getTime(), text: todoElement, isChecked: false }];
      }

      if (typeof window !== 'undefined' && localStorage) {
        try {
          localStorage.setItem('todo', JSON.stringify(updatedTodos));
          settodoList(updatedTodos);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          alert("Error saving task. Please try again.");
        }
      }
      settodoElement('');  
    }
  };

  // Toggle todo completion status in localStorage and state
  const handelTodoCheckBox = (e, todo) => {
    const { id } = todo;
    const newArr = todoList.map(td => td.id === id ? { ...td, isChecked: !td.isChecked } : td);

    try {
      settodoList(newArr);
      localStorage.setItem('todo', JSON.stringify(newArr));
    } catch (error) {
      console.error("Error updating todo status:", error);
      alert("Error updating task status.");
    }
  };

  // Remove a todo from localStorage and state
  const handleRemove = (e, todo) => {
    const { id } = todo;
    const newArr = todoList.filter(td => td.id !== id);

    try {
      settodoList(newArr);
      localStorage.setItem('todo', JSON.stringify(newArr));
    } catch (error) {
      console.error("Error removing todo:", error);
      alert("Error removing task.");
    }
  };

  // Edit a todo from localStorage and state
  const handleEdit = (todo) => {
    settodoElement(todo.text);
    setEditTodoId(todo.id);
  };

  return (
    <div className="container h-screen border">
      <h1 className="text-center p-2">Todo App</h1>

      <div className="w-full p-10 border">
        <input 
          type="text" 
          value={todoElement} 
          onChange={e => settodoElement(e.target.value)} 
          className="border w-full p-2"
          placeholder="Enter Task !" 
          onKeyPress={handelAddTodo} 
          autoFocus={true}
        />

        <div className="mt-2">
          {todoList.length > 0 ? (
            todoList.map((todo, ind) => (
              <div className="flex pl-2 items-center border borde-b mb-2 border-pink-500" key={todo.id}>
                <input 
                  type="checkbox" 
                  checked={todo.isChecked} 
                  onChange={(e) => handelTodoCheckBox(e, todo)}  
                  className="mr-2 h-6 w-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <p style={{ textDecoration: todo.isChecked ? "line-through" : "none" }}>
                  {todo.text}
                </p>

                <div className="ml-auto">
                  <button className="p-2 ml-2" onClick={() => handleEdit(todo)}>Edit</button>
                  <button className="p-2 ml-2" onClick={(e) => handleRemove(e, todo)}>X</button>
                </div>
              </div>
            ))
          ) : (
            <p>Please add some tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}
