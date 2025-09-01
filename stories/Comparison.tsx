import React, { useCallback, useState } from "react";
import "../dist/style.css";
import { Gantt, OnChangeTasks, Task, TaskOrEmpty, ViewMode } from "../src";
import { initTasksUser, onAddTask, onEditTask } from "./helper";

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
    <div >
      <Gantt
        {...props}
        enableTaskGrouping={true}
        comparisonLevels={1}
        onAddTask={onAddTask}
        onChangeTasks={onChangeTasks}
        onDoubleClick={handleDblClick}
        onEditTask={onEditTask}
        onClick={handleClick}
        tasks={tasks}
        viewMode={ViewMode.Year}
        distances={{
          minimumRowDisplayed: 10,
          rowHeight: 50,
          columnWidth: 300,
        }}
        canResizeColumns={true}
      />
    </div >
  );
};
