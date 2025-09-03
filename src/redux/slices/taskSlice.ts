import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  details?: string;
  category: string;
  color?: string;
  dueDate?: string;
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
}

interface TaskState {
  tasks: Task[];
  categories: Category[];
}

const initialState: TaskState = {
  tasks: [
    {
      id: "1",
      title: "Setup project",
      category: "Work",
      details: "Initialize Vite project and install dependencies",
      color: "#607d8b",
    },
    {
      id: "2",
      title: "Design login page",
      category: "Work",
      details: "Create a stunning login page UI",
      color: "#ff9800",
    },
    {
      id: "3",
      title: "Buy groceries",
      category: "Personal",
      details: "Milk, Bread, Cheese",
      color: "#4caf50",
    },
  ],
  categories: [
    { id: "work", name: "Work" },
    { id: "personal", name: "Personal" },
  ],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    createCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },

    updateCategory: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = action.payload;
      const categoryToUpdate = state.categories.find((cat) => cat.id === id);

      if (categoryToUpdate) {
        const oldName = categoryToUpdate.name;
        categoryToUpdate.name = name;

        state.tasks.forEach((task) => {
          if (task.category === oldName) {
            task.category = name;
          }
        });
      }
    },

    deleteCategory: (state, action: PayloadAction<string>) => {
      const categoryIdToDelete = action.payload;
      const categoryToDelete = state.categories.find(
        (cat) => cat.id === categoryIdToDelete
      );

      if (categoryToDelete) {
        state.tasks = state.tasks.filter(
          (task) => task.category !== categoryToDelete.name
        );
        state.categories = state.categories.filter(
          (cat) => cat.id !== categoryIdToDelete
        );
      }
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  createTask,
  updateTask,
  deleteTask,
  createCategory,
  updateCategory,
  deleteCategory,
  setTasks,
} = taskSlice.actions;
export default taskSlice.reducer;
