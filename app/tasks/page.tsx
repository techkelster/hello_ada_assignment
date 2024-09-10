"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInComponent from "../components/auth/SignInComponent";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/services/task";
import { Task } from "@/types/types";

const Tasks = () => {
  const defaultTask: Task = {
    id: 0,
    title: "",
    description: "",
  };

  const { data: session, status } = useSession(); // Get the session data and its loading status
  const {
    data: tasks,
    isLoading,
    error: getTasksError,
    refetch,
  } = useGetTasksQuery(undefined, {
    skip: status !== "authenticated", // Only fetch tasks if the user is authenticated
  });
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [editingTask, setEditingTask] = useState<Task>(defaultTask);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      refetch(); // Refetch tasks when the session changes to authenticated
    }
  }, [status, refetch]); // Refetch tasks when the session status changes

  if (status === "loading") {
    return <p className="text-center">Loading session...</p>; // Show a loading state while session is being loaded
  }

  if (!session) {
    return <SignInComponent />;
  }

  const handleCreateTask = async (title: string, description: string) => {
    await createTask({ title, description }).unwrap();
    setEditingTask(defaultTask);
    refetch(); // Refetch tasks after a new task is created
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (title: string, description: string) => {
    await updateTask({ id: editingTask.id, title, description }).unwrap();
    setEditingTask(defaultTask);
    refetch(); // Refetch tasks after a task is updated
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id).unwrap();
    refetch(); // Refetch tasks after a task is deleted
  };

  const getErrorMessage = (error: any) => {
    if (!error) return null;
    if (error.status) return `Error ${error.status}: ${error.data}`;
    if (error.message) return error.message;
    return "An unknown error occurred";
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/tasks");
  };

  console.log(session, "here is the session");

  return (
    <div className="flex flex-col items-center  min-h-screen bg-gray-50 p-6">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">Hello Ada</h2>
        <div className="relative">
          {/* Profile button */}
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center transition-transform transform hover:scale-105"
          >
            {session?.user?.name?.charAt(0).toUpperCase()}
          </button>
          {/* Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 animate-fadeIn">
              <p className="px-4 py-2 text-gray-800">{session?.user?.name}</p>
              <p className="px-4 py-2 text-gray-500 text-sm">
                {session?.user?.email}
              </p>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition-all"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Task Manager */}
      <h1 className="text-4xl font-bold mb-6 text-blue-700 animate-fadeIn">
        Task Manager
      </h1>

      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
        <TaskForm
          editingTask={editingTask}
          onSave={editingTask.id ? handleUpdateTask : handleCreateTask}
        />

        {isLoading ? (
          <p className="mt-4 text-gray-500 animate-pulse">Loading...</p>
        ) : getTasksError ? (
          <p className="mt-4 text-red-500 animate-fadeIn">
            Error loading tasks: {getErrorMessage(getTasksError)}
          </p>
        ) : tasks && tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ) : (
          <p className="mt-4 text-gray-500">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
