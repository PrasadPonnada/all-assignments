import express, { Request, Response } from 'express';
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo } from "../db";

const router = express.Router();

interface ToDo {
  title: string;
  description: string;
  done: boolean;
  userId: string
}

router.post('/todos', authenticateJwt, (req: Request, res: Response) => {
  const todo: ToDo = req.body;
  todo.done = false;
  if (typeof req.headers['id'] === 'string') {
    todo.userId = req.headers['id']
  }
  const newTodo = new Todo(todo);
  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req: Request, res: Response) => {
  const userId = req.headers['id']

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req: Request, res: Response) => {
  const { todoId } = req.params;
  const userId = req.headers['id']

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

export default router;