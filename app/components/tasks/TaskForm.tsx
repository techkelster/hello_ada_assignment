import { useState, FC } from "react";
import { Task } from "@/types/types";

interface TaskFormProps {
  editingTask: Task;
  onSave: (title: string, description: string) => void;
}

const TaskForm: FC<TaskFormProps> = ({ editingTask, onSave }) => {
  const [title, setTitle] = useState(editingTask.title || "");
  const [description, setDescription] = useState(editingTask.description || "");

  const handleSave = () => {
    onSave(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={editingTask.id ? editingTask.title : "Title"}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
        />
      </div>
      <div className="mb-4">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={editingTask.id ? editingTask.description : "Description"}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
        />
      </div>
      <button
        onClick={handleSave}
        className={`bg-blue-500 w-full py-3 ${
          editingTask.id ? "bg-brown-500" : "bg-blue-500"
        } text-white rounded-lg shadow-lg hover:${
          editingTask.id ? "bg-brown-600" : "bg-blue-600"
        } transition-colors duration-300 transform hover:scale-105`}
      >
        {editingTask.id ? "Update Task" : "Add Task"}
      </button>
    </div>
  );
};

export default TaskForm;
