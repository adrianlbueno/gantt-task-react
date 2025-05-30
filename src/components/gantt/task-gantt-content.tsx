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
  Task,
  TaskContextualPaletteProps,
  TaskCoordinates,
  TaskDependencyContextualPaletteProps,
  TaskOrEmpty,
  TaskToHasDependencyWarningMap, TaskToRowIndexMap,
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
    if (!renderedRowIndexes) {
      return [null, null, null];
    }

    const [start, end] = renderedRowIndexes;

    const tasksRes: ReactNode[] = [];
    const arrowsRes: ReactNode[] = [];
    const selectedTasksRes: ReactNode[] = [];

    // task id -> true
    const addedSelectedTasks: Record<string, true> = {};

    // avoid duplicates
    // comparison level -> task from id -> task to id -> true
    const addedDependencies: Record<
      string,
      Record<string, Record<string, true>>
    > = {};
    console.log("mapGlobalRowIndexToTask", mapGlobalRowIndexToTask);


    for (let index = start; index <= end; ++index) {
      const task = mapGlobalRowIndexToTask.get(index);

      if (!task) {
        continue;
      }

      const { comparisonLevel = 1, id: taskId } = task;

      if (selectedIdsMirror[taskId] && !addedSelectedTasks[taskId]) {
        addedSelectedTasks[taskId] = true;

        const rowIndex =
          taskToRowIndexMap
            .get(comparisonLevel)
            ?.get(taskId);

        if (typeof rowIndex === "number") {
          const y = rowIndex * fullRowHeight;

          selectedTasksRes.push(
            <rect
              x={0}
              y={y}
              width="100%"
              height={fullRowHeight}
              fill={colorStyles.selectedTaskBackgroundColor}
              key={`selected-${taskId}`}
            />
          );
        }
      }

      if (comparisonLevel > comparisonLevels) {
        continue;
      }

      if (task.type === "empty" || task.type === "user") {
        continue;
      }

      const key = `${comparisonLevel}_${task.id}`;

      const criticalPathOnLevel = criticalPaths
        ? criticalPaths.get(comparisonLevel)
        : undefined;

      const isCritical = criticalPathOnLevel
        ? criticalPathOnLevel.tasks.has(task.id)
        : false;

      const {
        containerX,
        containerWidth,
        innerX1,
        innerX2,
        width,
        levelY,
        progressWidth,
        x1: taskX1,
        x2: taskX2,
      } = getTaskCoordinates(task);

      tasksRes.push(
        <svg
          id={task.id}
          className="TaskItemClassName"
          x={containerX + (additionalLeftSpace || 0)}
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
                ? checkTaskHasDependencyWarning(
                  task,
                  taskToHasDependencyWarningMap
                )
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
          />
        </svg>
      );

      const addedDependenciesAtLevel = addedDependencies[comparisonLevel] || {};
      if (!addedDependencies[comparisonLevel]) {
        addedDependencies[comparisonLevel] = addedDependenciesAtLevel;
      }

      const addedDependenciesAtTask = addedDependenciesAtLevel[taskId] || {};
      if (!addedDependenciesAtLevel[taskId]) {
        addedDependenciesAtLevel[taskId] = addedDependenciesAtTask;
      }

      const dependenciesAtLevel = dependencyMap.get(comparisonLevel);

      if (!dependenciesAtLevel) {
        continue;
      }

      const dependenciesByTask = dependenciesAtLevel.get(taskId);

      if (dependenciesByTask) {
        const criticalPathForTask = criticalPathOnLevel
          ? criticalPathOnLevel.dependencies.get(task.id)
          : undefined;

        dependenciesByTask
          .filter(({ source }) => visibleTasksMirror[source.id])
          .forEach(
            ({
              containerHeight,
              containerY,
              innerFromY,
              innerToY,
              marginBetweenTasks,
              ownTarget,
              source,
              sourceTarget,
            }) => {
              if (addedDependenciesAtTask[source.id]) {
                return;
              }

              addedDependenciesAtTask[source.id] = true;

              const isCritical = criticalPathForTask
                ? criticalPathForTask.has(source.id)
                : false;

              const { x1: fromX1, x2: fromX2 } = getTaskCoordinates(source);

              const containerX = Math.min(fromX1, taskX1) - 300;
              const containerWidth =
                Math.max(fromX2, taskX2) - containerX + 300;

              arrowsRes.push(
                <svg
                  className="ArrowClassName"
                  x={containerX + (additionalLeftSpace || 0)}
                  y={containerY}
                  width={containerWidth}
                  height={containerHeight}
                  key={`Arrow from ${source.id} to ${taskId} on ${comparisonLevel}`}
                >
                  <Arrow
                    colorStyles={colorStyles}
                    distances={distances}
                    taskFrom={source}
                    extremityFrom={sourceTarget}
                    fromX1={fromX1 - containerX}
                    fromX2={fromX2 - containerX}
                    fromY={innerFromY}
                    taskTo={task}
                    extremityTo={ownTarget}
                    toX1={taskX1 - containerX}
                    toX2={taskX2 - containerX}
                    toY={innerToY}
                    marginBetweenTasks={marginBetweenTasks}
                    fullRowHeight={fullRowHeight}
                    taskHeight={taskHeight}
                    isShowDependencyWarnings={isShowDependencyWarnings}
                    isCritical={isCritical}
                    rtl={rtl}
                    onArrowDoubleClick={onArrowDoubleClick}
                    onArrowClick={onArrowClick}
                    handleFixDependency={handleFixDependency}
                  />
                </svg>
              );
            }
          );
      }

      const dependentsAtLevel = dependentMap.get(comparisonLevel);

      if (!dependentsAtLevel) {
        continue;
      }

      const dependentsByTask = dependentsAtLevel.get(taskId);

      if (dependentsByTask) {
        dependentsByTask
          .filter(({ dependent }) => visibleTasksMirror[dependent.id])
          .forEach(
            ({
              containerHeight,
              containerY,
              innerFromY,
              innerToY,
              marginBetweenTasks,
              ownTarget,
              dependent,
              dependentTarget,
            }) => {
              const addedDependenciesAtDependent =
                addedDependenciesAtLevel[dependent.id] || {};
              if (!addedDependenciesAtLevel[dependent.id]) {
                addedDependenciesAtLevel[dependent.id] =
                  addedDependenciesAtDependent;
              }

              if (addedDependenciesAtDependent[taskId]) {
                return;
              }

              addedDependenciesAtDependent[taskId] = true;

              const criticalPathForTask = criticalPathOnLevel
                ? criticalPathOnLevel.dependencies.get(dependent.id)
                : undefined;

              const isCritical = criticalPathForTask
                ? criticalPathForTask.has(task.id)
                : false;

              const { x1: toX1, x2: toX2 } = getTaskCoordinates(dependent);

              const containerX = Math.min(toX1, taskX1) - 300;
              const containerWidth = Math.max(toX2, taskX2) - containerX + 300;

              arrowsRes.push(
                <svg
                  x={containerX + (additionalLeftSpace || 0)}
                  y={containerY}
                  width={containerWidth}
                  height={containerHeight}
                  key={`Arrow from ${taskId} to ${dependent.id} on ${comparisonLevel}`}
                >
                  <Arrow
                    colorStyles={colorStyles}
                    distances={distances}
                    taskFrom={task}
                    extremityFrom={ownTarget}
                    fromX1={taskX1 - containerX}
                    fromX2={taskX2 - containerX}
                    fromY={innerFromY}
                    taskTo={dependent}
                    extremityTo={dependentTarget}
                    toX1={toX1 - containerX}
                    toX2={toX2 - containerX}
                    toY={innerToY}
                    marginBetweenTasks={marginBetweenTasks}
                    fullRowHeight={fullRowHeight}
                    taskHeight={taskHeight}
                    isShowDependencyWarnings={isShowDependencyWarnings}
                    isCritical={isCritical}
                    rtl={rtl}
                    onArrowDoubleClick={onArrowDoubleClick}
                    onArrowClick={onArrowClick}
                    handleFixDependency={handleFixDependency}
                  />
                </svg>
              );
            }
          );
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
