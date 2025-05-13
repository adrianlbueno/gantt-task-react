import {
  GlobalRowIndexToTaskMap,
  RowIndexToTaskMap,
  RowIndexToTasksMap,
  TaskOrEmpty,
  TaskToRowIndexMap
} from "../types/public-types";

export const getMapTaskToRowIndexWithGrouping = (
  tasks: readonly TaskOrEmpty[],
  comparisonLevels: number,
  isGrouped: boolean = false
): [
    TaskToRowIndexMap,
    RowIndexToTaskMap,
    GlobalRowIndexToTaskMap,
    RowIndexToTasksMap
  ] => {
  const taskToRowIndexMap = new Map<number, Map<string, number>>();
  const rowIndexToTaskMap = new Map<number, Map<number, TaskOrEmpty>>();
  const rowIndexToTasksMap = new Map<number, Map<number, TaskOrEmpty[]>>();
  const mapGlobalRowIndexToTask = new Map<number, TaskOrEmpty>();

  const parentMap = new Map<string, TaskOrEmpty>(
    tasks.map((task) => [task.id, task])
  );

  let globalRowIndex = 0;

  for (let comparisonLevel = 1; comparisonLevel <= comparisonLevels; comparisonLevel++) {
    const taskToRowIndexMapAtLevel = new Map<string, number>();
    const rowIndexToTaskMapAtLevel = new Map<number, TaskOrEmpty>();
    const rowIndexToTasksMapAtLevel = new Map<number, TaskOrEmpty[]>();

    taskToRowIndexMap.set(comparisonLevel, taskToRowIndexMapAtLevel);
    rowIndexToTaskMap.set(comparisonLevel, rowIndexToTaskMapAtLevel);
    rowIndexToTasksMap.set(comparisonLevel, rowIndexToTasksMapAtLevel);

    let rowIndex = 0;

    for (const task of tasks) {
      const level = task.comparisonLevel ?? 1;
      if (level !== comparisonLevel) continue;

      const { id, parent } = task;

      let assignedRowIndex = rowIndex;

      if (isGrouped && parent && parentMap.has(parent)) {
        const parentTask = parentMap.get(parent);
        const isGroupedAudit =
          parentTask?.type === "user" && parentTask?.hideChildren;

        if (isGroupedAudit) {
          const parentRowIndex = taskToRowIndexMapAtLevel.get(parent);
          if (typeof parentRowIndex === "number") {
            assignedRowIndex = parentRowIndex;
          }
        }
      }

      taskToRowIndexMapAtLevel.set(id, assignedRowIndex);
      rowIndexToTaskMapAtLevel.set(assignedRowIndex, task);

      const existingTasks = rowIndexToTasksMapAtLevel.get(assignedRowIndex) ?? [];
      rowIndexToTasksMapAtLevel.set(assignedRowIndex, [...existingTasks, task]);

      mapGlobalRowIndexToTask.set(globalRowIndex, task);

      // Only increment if we used the current row
      if (assignedRowIndex === rowIndex) {
        rowIndex++;
      }

      globalRowIndex++;
    }
  }

  return [
    taskToRowIndexMap,
    rowIndexToTaskMap,
    mapGlobalRowIndexToTask,
    rowIndexToTasksMap
  ];
};
