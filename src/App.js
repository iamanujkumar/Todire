import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  // State variables for managing todos and UI state
  const [isCompleteScreen, setIsCompleteScreen] = useState(false); // Tracks whether to show all todos or completed todos
  const [allTodos, setTodos] = useState([]); // Stores all todos
  const [newTitle, setNewTitle] = useState(''); // Stores the title of new todo
  const [newDescription, setNewDescription] = useState(''); // Stores the description of new todo
  const [completedTodos, setCompletedTodos] = useState([]); // Stores completed todos
  const [currentEdit, setCurrentEdit] = useState(''); // Tracks the index of currently edited todo
  const [currentEditedItem, setCurrentEditedItem] = useState(''); // Stores the currently edited todo item

  // Function to add a new todo
  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr)); // Store todos in local storage
    setNewTitle('');
    setNewDescription('');
  };

  // Function to delete a todo
  const handleDeleteTodo = index => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1); // Remove only the item at the specified index

    localStorage.setItem('todolist', JSON.stringify(reducedTodo)); // Update local storage
    setTodos(reducedTodo);
  };

  // Function to mark a todo as completed
  const handleComplete = index => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index); // Remove from todos after marking as completed
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr)); // Store completed todos in local storage
  };

  // Function to delete a completed todo
  const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo)); // Update local storage
    setCompletedTodos(reducedTodo);
  };

  // Load todos from local storage on component mount
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  // Function to handle editing a todo
  const handleEdit = (ind, item) => {
    setCurrentEdit(ind); // Set index of the todo being edited
    setCurrentEditedItem(item); // Set the current item being edited
  };

  // Function to update the title of the todo being edited
  const handleUpdateTitle = value => {
    setCurrentEditedItem(prev => {
      return { ...prev, title: value };
    });
  };

  // Function to update the description of the todo being edited
  const handleUpdateDescription = value => {
    setCurrentEditedItem(prev => {
      return { ...prev, description: value };
    });
  };

  // Function to update the todo list after editing
  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo); // Update todos
    setCurrentEdit(''); // Clear current edit state
  };

  // Rendering the UI
  return (
    <div className="App">
      <h1 style={{ color: 'rgb(227, 198, 0)' }}>Todire</h1>

      <div className="todo-wrapper">
        {/* Input section for adding new todos */}
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        {/* Buttons to toggle between todo and completed todo views */}
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        {/* Display todo or completed todo list based on isCompleteScreen */}
        <div className="todo-list">
          {/* Displaying active todos */}
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                // Display edit form for selected todo
                return (
                  <div className="edit__wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={e => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Title"
                      rows={4}
                      onChange={e => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                );
              } else {
                // Displaying normal todo item
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {/* Displaying completed todos */}
          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>
                  <div className='delete'>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
