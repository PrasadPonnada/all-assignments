import { useState, useEffect } from 'react';
import { authState } from '../store/authState.js';
import { useRecoilValue } from 'recoil';
import { AuthState, ToDoRequest, ToDoResponse } from './Model.js';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
  const [todos, setTodos] = useState<ToDoResponse[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const authStateValue: AuthState = useRecoilValue<AuthState>(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const getTodos = async () => {
      const response = await fetch('http://localhost:3000/todo/todos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Todo: Create a type for the response that you get back from the server
      const data: ToDoResponse[] = await response.json();
      setTodos(data);
    };
    getTodos();
  }, [authStateValue.token]);

  const addTodo = async () => {
    const request: ToDoRequest = { title, description };
    const response = await fetch('http://localhost:3000/todo/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(request),
    });
    const data: ToDoResponse = await response.json();
    setTodos([...todos, data]);
  };

  const markDone = async (id: string) => {
    const response = await fetch(
      `http://localhost:3000/todo/todos/${id}/done`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    const updatedTodo: ToDoResponse = await response.json();
    setTodos(
      todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
    );
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h2>Welcome {authStateValue.username}</h2>
        <div style={{ marginTop: 25, marginLeft: 20 }}>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login', { relative: 'route' });
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <h2>Todo List</h2>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Title'
      />
      <input
        type='text'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Description'
      />
      <button onClick={addTodo}>Add Todo</button>
      {todos.map((todo) => (
        <div key={todo._id}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <button onClick={() => markDone(todo._id)}>
            {todo.done ? 'Done' : 'Mark as Done'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
