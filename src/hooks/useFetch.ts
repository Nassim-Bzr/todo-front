const API_URL = 'http://localhost:3000'; // Assurez-vous que l'URL correspond à votre backend

export const getTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTask = async (name: string) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTask = async (id: number, name: string) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
