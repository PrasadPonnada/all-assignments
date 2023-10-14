/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function useTodos() {
  const [todos, setTodos] = useState([]);

  // fetch all todos from server
  useEffect(() => {
    async function getToDos() {
      const response = await axios.get('http://localhost:3000/todos');
      console.log(response.data);
      setTodos(response.data);
    }
    getToDos();
  }, []);
  return [todos, setTodos];
}

function App() {
  const [todos, setTodos] = useTodos();
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const addTodo = async () => {
    const response = await axios.post('http://localhost:3000/todos', {
      title: input,
      description: 'test',
    });
    setTodos([...todos, response.data]);
    setInput('');
  };

  const deleteTodoHandler = async (id) => {
    await axios.delete(`http://localhost:3000/todos/${id}`);
    const activeTodos = todos.filter((item) => item.id !== id);
    setTodos(activeTodos);
  };

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type='text' value={input} onChange={handleInputChange} />
        <button onClick={addTodo}>Add</button>
      </div>
      <div>
        <h2>Todo List</h2>
        {todos.map((item) => {
          return (
            <Todo
              key={item.id}
              title={item.title}
              deleteTodoHandler={deleteTodoHandler}
              id={item.id}
            />
          );
        })}
      </div>
    </>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return (
    <div>
      <h4>
        {props.title + ' '}
        <button onClick={props.deleteTodoHandler.bind(this, props.id)}>
          Delete
        </button>
      </h4>
    </div>
  );
}

export default App;
