import type { MouseEvent, ReactNode } from "react";
import React, { useMemo } from "react";

import { checkHasChildren } from "../../helpers/check-has-children";
import { checkTaskHasDependencyWarning } from "../../helpers/check-task-has-dependency-warning";
import type { OptimizedListParams } from "../../helpers/use-optimized-list";
import { GanttRelationEvent } from "../../types/gantt-task-actions";
import {
  BarMoveAction,
  ChildByLevelMap,
  ChildOutOfParentWarnings,
  ColorStyles,
  CriticalPaths,
  DateExtremity,
  DependencyMap,
  DependentMap,
  Distances,
  FixPosition,
  GlobalRowIndexToTaskMap,
  RelationKind,
  RowIndexToTasksMap,
  Task,
  TaskContextualPaletteProps,
  TaskCoordinates,
  TaskDependencyContextualPaletteProps,
  TaskOrEmpty,
  TaskToHasDependencyWarningMap, TaskToRowIndexMap
} from "../../types/public-types";
import { Arrow } from "../other/arrow";
import { RelationLine } from "../other/relation-line";
import { TaskItem } from "../task-item/task-item";

export type TaskGanttContentProps = {
  authorizedRelations: RelationKind[];
  additionalLeftSpace: number;
  additionalRightSpace: number;
  childOutOfParentWarnings: ChildOutOfParentWarnings | null;
  childTasksMap: ChildByLevelMap;
  taskToRowIndexMap: TaskToRowIndexMap;
  colorStyles: ColorStyles;
  comparisonLevels: number;
  criticalPaths: CriticalPaths | null;
  dependencyMap: DependencyMap;
  dependentMap: DependentMap;
  enableTaskGrouping: boolean;
  rowIndexToTasksMap: RowIndexToTasksMap;
  distances: Distances;
  fixEndPosition?: FixPosition;
  fixStartPosition?: FixPosition;
  fontFamily: string;
  fontSize: string;
  fullRowHeight: number;
  ganttRelationEvent: GanttRelationEvent | null;
  getTaskCoordinates: (task: Task) => TaskCoordinates;
  getTaskGlobalIndexByRef: (task: Task) => number;
  handleBarRelationStart: (target: DateExtremity, task: Task) => void;
  handleDeleteTasks: (task: TaskOrEmpty[]) => void;
  handleFixDependency: (task: Task, delta: number) => void;
  handleTaskDragStart: (
    action: BarMoveAction,
    task: Task,
    clientX: number,
    taskRootNode: Element
  ) => void;
  isShowDependencyWarnings: boolean;
  mapGlobalRowIndexToTask: GlobalRowIndexToTaskMap;
  onArrowClick?: (
    taskFrom: Task,
    extremityFrom: DateExtremity,
    taskTo: Task,
    extremityTo: DateExtremity,
    event: React.MouseEvent<SVGElement>
  ) => void;
  onArrowDoubleClick: (taskFrom: Task, taskTo: Task) => void;
  onClick?: (task: Task, event: React.MouseEvent<SVGElement>) => void;
  onDoubleClick?: (task: Task) => void;
  renderedRowIndexes: OptimizedListParams | null;
  rtl: boolean;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  selectedIdsMirror: Readonly<Record<string, true>>;
  setTooltipTask: (task: Task | null, element: Element | null) => void;
  taskToHasDependencyWarningMap: TaskToHasDependencyWarningMap | null;
  taskYOffset: number;
  visibleTasksMirror: Readonly<Record<string, true>>;
  taskHeight: number;
  taskHalfHeight: number;
  ContextualPalette?: React.FC<TaskContextualPaletteProps>;
  TaskDependencyContextualPalette?: React.FC<TaskDependencyContextualPaletteProps>;
};

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  authorizedRelations,
  additionalLeftSpace,
  additionalRightSpace,
  childOutOfParentWarnings,
  childTasksMap,
  colorStyles,
  comparisonLevels,
  criticalPaths,
  dependencyMap,
  dependentMap,
  distances,
  fixEndPosition = undefined,
  fixStartPosition = undefined,
  fontFamily,
  fontSize,
  fullRowHeight,
  ganttRelationEvent,
  getTaskCoordinates,
  getTaskGlobalIndexByRef,
  handleBarRelationStart,
  handleDeleteTasks,
  handleFixDependency,
  handleTaskDragStart,
  isShowDependencyWarnings,
  enableTaskGrouping,
  rowIndexToTasksMap,
  mapGlobalRowIndexToTask,
  onArrowDoubleClick,
  onArrowClick,
  onDoubleClick,
  onClick,
  renderedRowIndexes,
  rtl,
  selectTaskOnMouseDown,
  selectedIdsMirror,
  setTooltipTask,
  taskToHasDependencyWarningMap,
  taskYOffset,
  taskHeight,
  taskHalfHeight,
  visibleTasksMirror,
  taskToRowIndexMap,
}) => {
  const [renderedTasks, renderedArrows, renderedSelectedTasks] = useMemo(() => {
    if (!renderedRowIndexes) return [null, null, null];

    const [start, end] = renderedRowIndexes;

    const tasksRes: ReactNode[] = [];
    const arrowsRes: ReactNode[] = [];
    const selectedTasksRes: ReactNode[] = [];

    const addedSelectedTasks: Record<string, true> = {};
    const addedDependencies: Record<string, Record<string, Record<string, true>>> = {};

    for (let index = start; index <= end; ++index) {
      const tasksAtRow: TaskOrEmpty[] = [];

      if (enableTaskGrouping) {
        for (let level = 1; level <= comparisonLevels; level++) {
          const levelMap = rowIndexToTasksMap.get(level);
          const rowTasks = levelMap?.get(index);

          if (Array.isArray(rowTasks)) {
            tasksAtRow.push(...rowTasks);
          }

        }
      } else {
        const task = mapGlobalRowIndexToTask.get(index);
        if (task) tasksAtRow.push(task);
      }
      for (const task of tasksAtRow) {
        const comparisonLevel = task.comparisonLevel ?? 1;
        const { id: taskId } = task;

        if (selectedIdsMirror[taskId] && !addedSelectedTasks[taskId]) {
          addedSelectedTasks[taskId] = true;

          const rowIndex = taskToRowIndexMap.get(comparisonLevel)?.get(taskId);
          if (typeof rowIndex === "number") {
            selectedTasksRes.push(
              <rect
                x={0}
                y={rowIndex * fullRowHeight}
                width="100%"
                height={fullRowHeight}
                fill={colorStyles.selectedTaskBackgroundColor}
                key={`selected-${taskId}`}
              />
            );
          }
        }

        if (comparisonLevel > comparisonLevels) continue;
        if (task.type === "empty" || task.type === "user") continue;

        const key = `${comparisonLevel}_${task.id}`;
        const criticalPathOnLevel = criticalPaths?.get(comparisonLevel);
        const isCritical = !!criticalPathOnLevel?.tasks.has(task.id);

        const {
          containerX, containerWidth, innerX1, innerX2, width, levelY,
          progressWidth, x1: taskX1, x2: taskX2
        } = getTaskCoordinates(task);

        tasksRes.push(
          <svg
            id={task.id}
            className="TaskItemClassName"
            x={containerX + additionalLeftSpace}
            y={levelY}
            width={containerWidth}
            height={fullRowHeight}
            key={key}
          >
            <TaskItem
              getTaskGlobalIndexByRef={getTaskGlobalIndexByRef}
              hasChildren={checkHasChildren(task, childTasksMap)}
              hasDependencyWarning={
                taskToHasDependencyWarningMap
                  ? checkTaskHasDependencyWarning(task, taskToHasDependencyWarningMap)
                  : false
              }
              progressWidth={progressWidth}
              progressX={rtl ? innerX2 : innerX1}
              selectTaskOnMouseDown={selectTaskOnMouseDown}
              task={task}
              taskYOffset={taskYOffset}
              width={width}
              x1={innerX1}
              x2={innerX2}
              childOutOfParentWarnings={childOutOfParentWarnings}
              distances={distances}
              taskHeight={taskHeight}
              taskHalfHeight={taskHalfHeight}
              isProgressChangeable={!task.isDisabled}
              isDateChangeable={!task.isDisabled}
              isRelationChangeable={!task.isRelationDisabled}
              authorizedRelations={authorizedRelations}
              ganttRelationEvent={ganttRelationEvent}
              isDelete={!task.isDisabled}
              onDoubleClick={onDoubleClick}
              onClick={onClick}
              onEventStart={handleTaskDragStart}
              setTooltipTask={setTooltipTask}
              onRelationStart={handleBarRelationStart}
              isSelected={Boolean(selectedIdsMirror[taskId])}
              isCritical={isCritical}
              rtl={rtl}
              fixStartPosition={fixStartPosition}
              fixEndPosition={fixEndPosition}
              handleDeleteTasks={handleDeleteTasks}
              colorStyles={colorStyles}
              enableTaskGrouping={enableTaskGrouping}
              getTaskInitials={(task) => {
                return task.name
                  ?.split(" ")
                  .map(word => word[0])
                  .join("")
                  .toUpperCase() ?? "";
              }}
            />
          </svg>
        );

        const addedDependenciesAtLevel = addedDependencies[comparisonLevel] ??= {};
        const addedDependenciesAtTask = addedDependenciesAtLevel[taskId] ??= {};

        const dependenciesAtLevel = dependencyMap.get(comparisonLevel);
        const dependenciesByTask = dependenciesAtLevel?.get(taskId);

        dependenciesByTask?.filter(({ source }) => visibleTasksMirror[source.id]).forEach(dep => {
          if (addedDependenciesAtTask[dep.source.id]) return;
          addedDependenciesAtTask[dep.source.id] = true;

          const { x1: fromX1, x2: fromX2 } = getTaskCoordinates(dep.source);
          const containerX = Math.min(fromX1, taskX1) - 300;
          const containerWidth = Math.max(fromX2, taskX2) - containerX + 300;
          const isDepCritical = !!criticalPathOnLevel?.dependencies.get(task.id)?.has(dep.source.id);

          arrowsRes.push(
            <svg
              className="ArrowClassName"
              x={containerX + additionalLeftSpace}
              y={dep.containerY}
              width={containerWidth}
              height={dep.containerHeight}
              key={`Arrow from ${dep.source.id} to ${taskId} on ${comparisonLevel}`}
            >
              <Arrow
                colorStyles={colorStyles}
                distances={distances}
                taskFrom={dep.source}
                extremityFrom={dep.sourceTarget}
                fromX1={fromX1 - containerX}
                fromX2={fromX2 - containerX}
                fromY={dep.innerFromY}
                taskTo={task}
                extremityTo={dep.ownTarget}
                toX1={taskX1 - containerX}
                toX2={taskX2 - containerX}
                toY={dep.innerToY}
                marginBetweenTasks={dep.marginBetweenTasks}
                fullRowHeight={fullRowHeight}
                taskHeight={taskHeight}
                isShowDependencyWarnings={isShowDependencyWarnings}
                isCritical={isDepCritical}
                rtl={rtl}
                onArrowDoubleClick={onArrowDoubleClick}
                onArrowClick={onArrowClick}
                handleFixDependency={handleFixDependency}
              />
            </svg>
          );
        });

        const dependentsAtLevel = dependentMap.get(comparisonLevel);
        const dependentsByTask = dependentsAtLevel?.get(taskId);

        dependentsByTask?.filter(({ dependent }) => visibleTasksMirror[dependent.id]).forEach(dep => {
          console.log("dependent", dep)
          const addedDepsForDep = addedDependenciesAtLevel[dep.dependent.id] ??= {};

          if (addedDepsForDep[taskId]) return;
          addedDepsForDep[taskId] = true;

          const isDepCritical = !!criticalPathOnLevel?.dependencies.get(dep.dependent.id)?.has(task.id);
          const { x1: toX1, x2: toX2 } = getTaskCoordinates(dep.dependent);
          const containerX = Math.min(toX1, taskX1) - 300;
          const containerWidth = Math.max(toX2, taskX2) - containerX + 300;

          arrowsRes.push(
            <svg
              className="ArrowClassName"
              x={containerX + additionalLeftSpace}
              y={dep.containerY}
              width={containerWidth}
              height={dep.containerHeight}
              key={`Arrow from ${taskId} to ${dep.dependent.id} on ${comparisonLevel}`}
            >
              <Arrow
                colorStyles={colorStyles}
                distances={distances}
                taskFrom={task}
                extremityFrom={dep.ownTarget}
                fromX1={taskX1 - containerX}
                fromX2={taskX2 - containerX}
                fromY={dep.innerFromY}
                taskTo={dep.dependent}
                extremityTo={dep.dependentTarget}
                toX1={toX1 - containerX}
                toX2={toX2 - containerX}
                toY={dep.innerToY}
                marginBetweenTasks={dep.marginBetweenTasks}
                fullRowHeight={fullRowHeight}
                taskHeight={taskHeight}
                isShowDependencyWarnings={isShowDependencyWarnings}
                isCritical={isDepCritical}
                rtl={rtl}
                onArrowDoubleClick={onArrowDoubleClick}
                onArrowClick={onArrowClick}
                handleFixDependency={handleFixDependency}
              />
            </svg>
          );
        });
      }
    }

    return [tasksRes, arrowsRes, selectedTasksRes];
  }, [
    additionalLeftSpace,
    additionalRightSpace,
    colorStyles,
    dependencyMap,
    dependentMap,
    fullRowHeight,
    ganttRelationEvent,
    getTaskCoordinates,
    mapGlobalRowIndexToTask,
    renderedRowIndexes,
    selectTaskOnMouseDown,
    selectedIdsMirror,
    visibleTasksMirror,
    rowIndexToTasksMap,
    enableTaskGrouping
  ]);

  return (
    <g className="content">
      {renderedSelectedTasks}

      <g
        className="arrows"
        fill={colorStyles.arrowColor}
        stroke={colorStyles.arrowColor}
      >
        {renderedArrows}
      </g>

      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {renderedTasks}
      </g>

      {ganttRelationEvent && (
        <RelationLine
          x1={ganttRelationEvent.startX}
          x2={ganttRelationEvent.endX}
          y1={ganttRelationEvent.startY}
          y2={ganttRelationEvent.endY}
        />
      )}
    </g>
  );
};
