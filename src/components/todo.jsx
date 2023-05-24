import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const ToDo = () => {
    const [todoList, setTodoList] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [newTaskStartDate, setNewTaskStartDate] = useState("");
    const [newTaskEndDate, setNewTaskEndDate] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedTaskStartDate, setEditedTaskStartDate] = useState("");
    const [editedTaskEndDate, setEditedTaskEndDate] = useState("");

    useEffect(() => {
    fetchTodoList();
    }, []);

    const fetchTodoList = async () => {
    try {
        const response = await axios.get("http://localhost:3000/todo-list");
        setTodoList(response.data);
    } catch (error) {
        console.error("Błąd podczas pobierania listy zadań.", error);
    }
    };

    const addTask = async (e) => {
    e.preventDefault();

    if (newTask.trim() === "") {
        return;
    }

    const newTodoItem = {
        task: newTask,
        startDate: newTaskStartDate,
        endDate: newTaskEndDate,
        done: false,
    };

    try {
        await axios.post("http://localhost:3000/todo-list", newTodoItem);
        fetchTodoList();
        setNewTask("");
        setNewTaskStartDate("");
        setNewTaskEndDate("");
    } catch (error) {
        console.error("Błąd podczas dodawania zadania.", error);
    }
    };

    const toggleTaskStatus = async (todoItem) => {
    const updatedTodoItem = {
        ...todoItem,
        done: !todoItem.done,
    };

    try {
        await axios.put(
        `http://localhost:3000/todo-list/${todoItem.id}`,
        updatedTodoItem
        );
        fetchTodoList();
    } catch (error) {
        console.error("Błąd podczas aktualizowania statusu zadania.", error);
    }
    };

    const deleteTask = async (todoItem) => {
    try {
        await axios.delete(`http://localhost:3000/todo-list/${todoItem.id}`);
        fetchTodoList();
    } catch (error) {
        console.error("Błąd podczas usuwania zadania.", error);
    }
    };

    const startEditingTask = (taskId, task, startDate, endDate) => {
    setEditingTaskId(taskId);
    setEditedTask(task);
    setEditedTaskStartDate(startDate);
    setEditedTaskEndDate(endDate);
    };

    const saveEditedTask = async (taskId) => {
    const updatedTodoItem = {
        task: editedTask,
        startDate: editedTaskStartDate,
        endDate: editedTaskEndDate,
    };

    try {
        await axios.put(
        `http://localhost:3000/todo-list/${taskId}`,
        updatedTodoItem
        );
        fetchTodoList();
        cancelEditingTask();
    } catch (error) {
        console.error("Błąd podczas aktualizowania zadania.", error);
    }
    };

    const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditedTask("");
    setEditedTaskStartDate("");
    setEditedTaskEndDate("");
    };

    return (
    <div className="container">
        <h1>Lista zadań</h1>
        <table className="table table-striped">
        <thead>
            <tr>
            <th>Zadanie</th>
            <th>Data rozpoczęcia</th>
            <th>Data zakończenia</th>
            <th>Status</th>
            <th>Akcje</th>
            </tr>
        </thead>
        <tbody>
            {todoList.map((todoItem) => (
            <tr key={todoItem.id}>
                <td
                style={{
                    textDecoration: todoItem.done ? "line-through" : "none",
                }}
                >
                {editingTaskId === todoItem.id ? (
                    <input
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    />
                ) : (
                    todoItem.task
                )}
                </td>
                <td>
                {editingTaskId === todoItem.id ? (
                    <input
                    type="date"
                    value={editedTaskStartDate}
                    onChange={(e) => setEditedTaskStartDate(e.target.value)}
                    />
                ) : (
                    todoItem.startDate
                )}
                </td>
                <td>
                {editingTaskId === todoItem.id ? (
                    <input
                    type="date"
                    value={editedTaskEndDate}
                    onChange={(e) => setEditedTaskEndDate(e.target.value)}
                    />
                ) : (
                    todoItem.endDate
                )}
                </td>
                <td>
                <input
                    type="checkbox"
                    checked={todoItem.done}
                    onChange={() => toggleTaskStatus(todoItem)}
                />
                </td>
                <td>
                {editingTaskId === todoItem.id ? (
                    <>
                    <button
                        className="btn btn-success"
                        onClick={() => saveEditedTask(todoItem.id)}
                    >
                        Zapisz
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={cancelEditingTask}
                    >
                        Anuluj
                    </button>
                    </>
                ) : (
                    <>
                    <button
                        className="btn btn-primary"
                        disabled={todoItem.done}
                        onClick={() =>
                        startEditingTask(
                            todoItem.id,
                            todoItem.task,
                            todoItem.startDate,
                            todoItem.endDate
                        )
                        }
                    >
                        Edytuj
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => deleteTask(todoItem)}
                    >
                        Usuń
                    </button>
                    </>
                )}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
        <form onSubmit={addTask}>
        <div className="form-group">
            <label htmlFor="task">Zadanie</label>
            <input
            type="text"
            id="task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="form-control"
            />
        </div>
        <div className="form-group">
            <label htmlFor="startDate">Data rozpoczęcia</label>
            <input
            type="date"
            id="startDate"
            value={newTaskStartDate}
            onChange={(e) => setNewTaskStartDate(e.target.value)}
            className="form-control"
            />
        </div>
        <div className="form-group">
            <label htmlFor="endDate">Data zakończenia</label>
            <input
            type="date"
            id="endDate"
            value={newTaskEndDate}
            onChange={(e) => setNewTaskEndDate(e.target.value)}
            className="form-control"
            />
        </div>
        <button type="submit" className="btn btn-primary">
            Dodaj zadanie
        </button>
        </form>
    </div>
    );
};

export default ToDo;
