import { FC } from "react";
import { Task } from "@/types/types";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <li className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded-lg shadow-sm transition-transform transform hover:scale-105">
      <div>
        <h2 className="text-lg font-semibold text-blue-600">{task.title}</h2>
        <p className="text-gray-700">{task.description}</p>
      </div>
      <div>
        <button
          onClick={() => onEdit(task)}
          className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
