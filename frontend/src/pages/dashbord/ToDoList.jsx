import React, { useEffect, useState } from "react";
import { server } from "../../main";
import axios from "axios";
import "./ToDoList.css";
import { LuDelete } from "react-icons/lu";
import Collapsible from "react-collapsible";

const ToDoList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", progress: 0 });
  const [newSubtask, setNewSubtask] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${server}/api/todolist/${userId}`);
        const { tasks } = response.data;
    
        // Calculate progress for each task
        const updatedTasks = tasks.map((task) => {
          const totalSubtasks = task.subtasks.length;
          const completedSubtasks = task.subtasks.filter((subtask) => subtask.completionStatus).length;
          const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
          return { ...task, progress };
        });
    
        setTasks(updatedTasks);
        calculateTaskStatus(updatedTasks);
      } catch (err) {
        setError("Failed to fetch ToDo list. Please try again later.");
      } finally {
        setLoading(false);
      }
    };    

    if (userId) {
      fetchToDoList();
    }
  }, [userId]);

  const calculateTaskStatus = (tasks) => {
    const status = { ongoing: 0, inProcess: 0, completed: 0 };
    tasks.forEach((task) => {
      const totalSubtasks = task.subtasks.length;
      const completedSubtasks = task.subtasks.filter((subtask) => subtask.completionStatus).length;

      if (completedSubtasks === 0) {
        status.ongoing += 1; // No subtasks completed
      } else if (completedSubtasks < totalSubtasks) {
        status.inProcess += 1; // Some subtasks completed
      } else if (completedSubtasks === totalSubtasks) {
        status.completed += 1; // All subtasks completed
      }
    });
    setTaskStatus(status);
  };

  const addTask = async () => {
    if (!newTask.title) {
      alert("Please enter a valid task title.");
      return;
    }
    try {
      const response = await axios.post(`${server}/api/todolist/${userId}`, {
        tasks: [...tasks, { title: newTask.title, subtasks: [], progress: 0 }],
      });
      const updatedTasks = response.data.toDoList.tasks;
      setTasks(updatedTasks);
      calculateTaskStatus(updatedTasks);
      setNewTask({ title: "", progress: 0 });
    } catch (err) {
      alert("Failed to add task. Please try again.");
    }
  };

  const addSubtask = async (taskId) => {
    if (!newSubtask) {
      alert("Please enter a valid subtask title.");
      return;
    }
    try {
      await axios.post(`${server}/api/todolist/${userId}/${taskId}/subtask`, {
        title: newSubtask,
      });
  
      // Fetch updated tasks from the server to ensure proper `_id` mapping
      const response = await axios.get(`${server}/api/todolist/${userId}`);
      const { tasks } = response.data;
  
      const updatedTasks = tasks.map((task) => {
        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter((subtask) => subtask.completionStatus).length;
        const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
        return { ...task, progress };
      });
  
      setTasks(updatedTasks);
      calculateTaskStatus(updatedTasks);
      setNewSubtask("");
    } catch (err) {
      alert("Failed to add subtask. Please try again.");
    }
  };
  

  const toggleSubtaskCompletion = async (taskId, subtaskId) => {
    try {
      await axios.put(`${server}/api/todolist/${userId}/${taskId}/${subtaskId}`);
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          task.subtasks = task.subtasks.map((subtask) => {
            if (subtask._id === subtaskId) {
              subtask.completionStatus = !subtask.completionStatus;
            }
            return subtask;
          });
          const completedSubtasks = task.subtasks.filter((subtask) => subtask.completionStatus).length;
          const totalSubtasks = task.subtasks.length;
          task.progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
        }
        return task;
      });
      setTasks(updatedTasks);
      calculateTaskStatus(updatedTasks);
    } catch (err) {
      alert("Failed to update subtask completion status.");
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      await axios.delete(`${server}/api/todolist/${userId}/${taskId}/${subtaskId}`);
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          task.subtasks = task.subtasks.filter((subtask) => subtask._id !== subtaskId);
          const completedSubtasks = task.subtasks.filter((subtask) => subtask.completionStatus).length;
          const totalSubtasks = task.subtasks.length;
          task.progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
        }
        return task;
      });
      setTasks(updatedTasks);
      calculateTaskStatus(updatedTasks);
    } catch (err) {
      alert("Failed to delete subtask.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${server}/api/todolist/${userId}/${taskId}`);
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      calculateTaskStatus(updatedTasks);
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }


  return (
    <div className="todo-container">
      {/* Task Status Section */}
      <div className="task-status">
        {[
          { color: "red", label: "On going", count: taskStatus.ongoing || 0 },
          { color: "yellow", label: "In Process", count: taskStatus.inProcess || 0 },
          { color: "green", label: "Completed", count: taskStatus.completed || 0 },
        ].map(({ color, label, count }, index) => (
          <div key={index} className={`status-card ${color}`}>
            <p className="status-label">{label}</p>
            <p className="status-count">{count} Tasks</p>
          </div>
        ))}
      </div>
  
      {/* Add New Task Section */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <button className="addtask-btn" onClick={addTask}>
          Add Task
        </button>
      </div>
  
      {/* Recent Tasks Section */}
      <div className="recent-tasks">
        <h3 className="recent-tasks-title">Recent Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks available. Add your first task!</p>
        ) : (
          tasks.map((task) => (
            <Collapsible 
              key={task._id}
              trigger={
                <div className="task-card">
                  <div className="task-details">
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-tasks">{task.subtasks.length} Subtasks</p>
                  </div>
                  <div className="task-progress">
                    <svg className="progress-circle" viewBox="0 0 36 36">
                      <path
                        className="progress-bg"
                        d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                      />
                      <path
                        className="progress-bar"
                        d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                        style={{
                          strokeDasharray: `${task.progress || 0}, 100`,
                        }}
                      />
                    </svg>
                    <p className="progress-percentage">
                      {task.progress !== undefined
                        ? task.progress.toFixed(0)
                        : "00"}
                      %
                    </p>
                  </div>
                  <button
                    className="delete-task"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent collapsing on delete
                      deleteTask(task._id);
                    }}
                  >
                    <LuDelete />
                  </button>
                </div>
              }
              className="task-collapsible"
              openedClassName="task-collapsible-opened"
            >
              <div className="subtasks-list">
                {task.subtasks.map((subtask) => (
                  <div key={subtask._id} className="subtask">
                    <input className="subtask-check"
                      type="checkbox"
                      checked={subtask.completionStatus}
                      onChange={() => toggleSubtaskCompletion(task._id, subtask._id)}
                    />
                    <span
                      className={subtask.completionStatus ? "completed" : ""}
                    >
                      {subtask.title}
                    </span>
                    <button
                      className="delete-subtask"
                      onClick={() => deleteSubtask(task._id, subtask._id)}
                    >
                      <LuDelete />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-task">
                <input
                  type="text"
                  placeholder="New Subtask Title"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                />
                <button className="addtask-btn" onClick={() => addSubtask(task._id)}>Add Subtask</button>
              </div>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
  
};

export default ToDoList;
