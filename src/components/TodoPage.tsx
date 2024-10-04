import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../hooks/useFetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './TodoPage.css';

const MySwal = withReactContent(Swal);

interface Task {
  id: number;
  name: string;
}

const TodoPage = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editableTaskId, setEditableTaskId] = useState<number | null>(null);
  const [editedTaskName, setEditedTaskName] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasks();
        setTasks(tasks);
      } catch (err) {
        setError('Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (newTaskName.trim() === '') {
      setError('Task name cannot be empty');
      return;
    }
    try {
      const newTask = await createTask(newTaskName);
      setTasks([...tasks, newTask]);
      setNewTaskName('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleEditTask = (id: number, name: string) => {
    setEditableTaskId(id);
    setEditedTaskName(name);
  };

  const handleUpdateTask = async (id: number) => {
    if (editedTaskName.trim() === '') {
      setError('Task name cannot be empty');
      return;
    }
    try {
      await updateTask(id, editedTaskName);
      setTasks(tasks.map(task => (task.id === id ? { ...task, name: editedTaskName } : task)));
      setEditableTaskId(null);
      setEditedTaskName('');
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    const result = await MySwal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Non, annuler!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
        MySwal.fire('Supprimé!', 'Votre tâche a été supprimée.', 'success');
      } catch (err) {
        setError('Failed to delete task');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      MySwal.fire('Annulé', 'Votre tâche est en sécurité :)', 'error');
    }
  };

  return (
    <div className="todo-container">
      <img src="https://www.hdmnetwork.com/assets/images/Logo.jpg" alt="Logo" className="logo" />
      <h1>To do List Hdm</h1>
      {error && <p className="error">{error}</p>}
      <div className="input-container">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Nouvelle tâche"
        />
        <button onClick={handleCreateTask}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            <input
              type="text"
              value={editableTaskId === task.id ? editedTaskName : task.name}
              onChange={(e) => setEditedTaskName(e.target.value)}
              disabled={editableTaskId !== task.id}
            />
            {editableTaskId === task.id ? (
              <button onClick={() => handleUpdateTask(task.id)}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
            ) : (
              <button onClick={() => handleEditTask(task.id, task.name)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
            <button onClick={() => handleDeleteTask(task.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
