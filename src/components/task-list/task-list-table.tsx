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

    // Grouping enabled: filter out children of collapsed users  
    return tasks.filter(task => {
      const parent = tasks.find(t => t.id === task.parent);

      const isGroupedChildOfCollapsedUser =
        parent &&
        parent.type === "user" &&
        parent.hideChildren === true;

      return !isGroupedChildOfCollapsedUser;
    });
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
            key={id}
            tasks={tasks}
            draggedTask={draggedTask}
            setDraggedTask={setDraggedTask}
          />
        );
      }
    } else {
      for (let rowIndex = start; rowIndex <= end; rowIndex++) {
        for (const [comparisonLevel, rowMap] of rowIndexToTasksMap.entries()) {
          const taskList = rowMap.get(rowIndex);
          if (!taskList) continue;

          for (const task of taskList) {
            const parent = tasks.find(t => t.id === task.parent);
            const isGroupedChildOfCollapsedUser =
              parent &&
              parent.type === "user" &&
              parent.hideChildren === true;

            console.log('isGroupedChildOfCollapsedUser :>> ', isGroupedChildOfCollapsedUser);

            if (isGroupedChildOfCollapsedUser) {
              continue;
            }
            const { id } = task;
            const indexesOnLevel = mapTaskToNestedIndex.get(comparisonLevel);
            const taskIndex = indexesOnLevel?.get(id);
            const [depth, indexStr] = taskIndex ?? [0, ""];

            renderList.push(
              <TaskListTableRow
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
                key={id}
                tasks={tasks}
                draggedTask={draggedTask}
                setDraggedTask={setDraggedTask}
              />
            );
          }
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
    colors,
    columns,
    cutIdsMirror,
    fullRowHeight,
    getTaskCurrentState,
    renderedIndexes,
    renderedTasks,
    selectTaskOnMouseDown,
    selectedIdsMirror,
    draggedTask,
    rowIndexToTasksMap,
    enableTaskGrouping,
    mapTaskToNestedIndex,
  ]);


  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {renderedListWithOffset}
    </div>
  );
};

export const TaskListTableDefault = memo(TaskListTableDefaultInner);
