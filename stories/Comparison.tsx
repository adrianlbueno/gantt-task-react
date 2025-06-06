import React, { useCallback, useState } from "react";

import { Gantt, OnChangeTasks, Task, TaskOrEmpty } from "../src";

import { initTasksUser, onAddTask, onEditTask } from "./helper";

import "../dist/style.css";

export const Comparison: React.FC = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(() => {
    const firstLevelTasks = initTasksUser();

    firstLevelTasks.map(
      (task) => ({
        ...task,
        comparisonLevel: 2
      } as TaskOrEmpty));

    return [...firstLevelTasks];
  });

  const onChangeTasks = useCallback<OnChangeTasks>((nextTasks, action) => {
    switch (action.type) {
      case "delete_relation":
        if (
          window.confirm(
            `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
          )
        ) {
          setTasks(nextTasks);
        }
        break;

      case "delete_task":
        if (window.confirm("Are you sure?")) {
          setTasks(nextTasks);
        }
        break;

      default:
        setTasks(nextTasks);
        break;
    }
  }, []);

  const handleDblClick = useCallback((task: Task) => {
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: TaskOrEmpty) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  return (
    <Gantt
      {...props}
      enableTaskGrouping={true}
      onAddTask={onAddTask}
      onChangeTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTask={onEditTask}
      onClick={handleClick}
      tasks={tasks}
    />
  );
};
