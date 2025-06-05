import type { ReactNode } from "react";
import React, { memo, useMemo, useState } from "react";

import { Task, TaskListTableProps, TaskOrEmpty } from "../../types/public-types";
import { TaskListTableRow } from "./task-list-table-row";

import { checkHasChildren } from "../../helpers/check-has-children";
import styles from "./task-list-table.module.css";

const TaskListTableDefaultInner: React.FC<TaskListTableProps> = ({
  canMoveTasks,
  childTasksMap,
  colors,
  columns,
  cutIdsMirror,
  dateSetup,
  enableTaskGrouping,
  dependencyMap,
  distances,
  fontFamily,
  fontSize,
  fullRowHeight,
  getTaskCurrentState,
  handleAddTask,
  handleDeleteTasks,
  handleEditTask,
  handleMoveTaskBefore,
  handleMoveTaskAfter,
  handleMoveTasksInside,
  handleOpenContextMenu,
  icons,
  isShowTaskNumbers,
  mapTaskToNestedIndex,
  rowIndexToTasksMap,
  onClick,
  onExpanderClick,
  renderedIndexes,
  scrollToTask,
  selectTaskOnMouseDown,
  selectedIdsMirror,
  tasks,
}) => {

  const renderedTasks = useMemo(() => {
    if (!enableTaskGrouping) {
      return tasks.filter((task) => !task.comparisonLevel || task.comparisonLevel === 1);
    }

    return tasks.filter(task => task.type !== "user"); // render all non-user tasks
  }, [tasks, enableTaskGrouping]);


  const [draggedTask, setDraggedTask] = useState<TaskOrEmpty>(null);

  const renderedListWithOffset = useMemo(() => {
    if (!renderedIndexes) return null;

    const [start, end] = renderedIndexes;
    const renderList: ReactNode[] = [];

    if (!enableTaskGrouping) {
      for (let rowIndex = start; rowIndex <= end; rowIndex++) {
        const task = renderedTasks[rowIndex];
        if (!task) break;

        const { id, comparisonLevel = 1 } = task;
        const indexesOnLevel = mapTaskToNestedIndex.get(comparisonLevel);
        const taskIndex = indexesOnLevel?.get(id);
        const [depth, indexStr] = taskIndex ?? [0, ""];

        renderList.push(
          <TaskListTableRow
            key={id}
            canMoveTasks={canMoveTasks}
            colors={colors}
            columns={columns}
            dateSetup={dateSetup}
            dependencyMap={dependencyMap}
            depth={depth}
            distances={distances}
            fullRowHeight={fullRowHeight}
            getTaskCurrentState={getTaskCurrentState}
            handleAddTask={handleAddTask}
            handleDeleteTasks={handleDeleteTasks}
            handleEditTask={handleEditTask}
            handleMoveTaskBefore={handleMoveTaskBefore}
            handleMoveTaskAfter={handleMoveTaskAfter}
            handleMoveTasksInside={handleMoveTasksInside}
            handleOpenContextMenu={handleOpenContextMenu}
            hasChildren={checkHasChildren(task, childTasksMap)}
            icons={icons}
            indexStr={indexStr}
            isClosed={Boolean((task as Task)?.hideChildren)}
            isCut={cutIdsMirror[id]}
            isEven={rowIndex % 2 === 1}
            isSelected={selectedIdsMirror[id]}
            isShowTaskNumbers={isShowTaskNumbers}
            onClick={onClick}
            onExpanderClick={onExpanderClick}
            scrollToTask={scrollToTask}
            selectTaskOnMouseDown={selectTaskOnMouseDown}
            task={task}
            tasks={tasks}
            draggedTask={draggedTask}
            setDraggedTask={setDraggedTask}
          />
        );
      }
    } else {


      for (let rowIndex = start; rowIndex <= end; rowIndex++) {

        const taskList = rowIndexToTasksMap.get(1)?.get(rowIndex);
        if (!taskList) continue;

        for (const task of taskList) {
          const parent = tasks.find(t => t.id === task.parent);
          if (parent?.hideChildren) continue;

          const { id, comparisonLevel } = task;
          let depth = 0;
          let indexStr = "";
          console.log("comparisonLevel", comparisonLevel)
          const levelMap = mapTaskToNestedIndex.get(comparisonLevel);
          const taskIndex = levelMap?.get(id);
          if (taskIndex) {

            console.log('object :>> ', [depth, indexStr] = taskIndex);
            [depth, indexStr] = taskIndex;
          }

          renderList.push(
            <TaskListTableRow
              key={id}
              canMoveTasks={canMoveTasks}
              colors={colors}
              columns={columns}
              dateSetup={dateSetup}
              dependencyMap={dependencyMap}
              depth={depth}
              distances={distances}
              fullRowHeight={fullRowHeight}
              getTaskCurrentState={getTaskCurrentState}
              handleAddTask={handleAddTask}
              handleDeleteTasks={handleDeleteTasks}
              handleEditTask={handleEditTask}
              handleMoveTaskBefore={handleMoveTaskBefore}
              handleMoveTaskAfter={handleMoveTaskAfter}
              handleMoveTasksInside={handleMoveTasksInside}
              handleOpenContextMenu={handleOpenContextMenu}
              hasChildren={checkHasChildren(task, childTasksMap)}
              icons={icons}
              indexStr={indexStr}
              isClosed={Boolean((task as Task)?.hideChildren)}
              isCut={cutIdsMirror[id]}
              isEven={rowIndex % 2 === 1}
              isSelected={selectedIdsMirror[id]}
              isShowTaskNumbers={isShowTaskNumbers}
              onClick={onClick}
              onExpanderClick={onExpanderClick}
              scrollToTask={scrollToTask}
              selectTaskOnMouseDown={selectTaskOnMouseDown}
              task={task}
              tasks={tasks}
              draggedTask={draggedTask}
              setDraggedTask={setDraggedTask}
            />
          );
        }
      }
    }

    return (
      <>
        <div style={{ height: fullRowHeight * start }} />
        {renderList}
      </>
    );
  }, [
    renderedIndexes,
    renderedTasks,
    rowIndexToTasksMap,
    mapTaskToNestedIndex,
    tasks,
    enableTaskGrouping,
    fullRowHeight,
    colors,
    columns,
    cutIdsMirror,
    getTaskCurrentState,
    selectTaskOnMouseDown,
    selectedIdsMirror,
    draggedTask,
  ]);

  return (
    <div
      className={styles.taskListWrapper}
      style={{ fontFamily, fontSize }}
    >
      {renderedListWithOffset}
    </div>
  );
};

export const TaskListTableDefault = memo(TaskListTableDefaultInner);
