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
  const parentMap = new Map(tasks.map(t => [t.id, t]));
  const rowCounterPerLevel: Record<number, number> = {};

  for (let level = 1; level <= comparisonLevels; level++) {
    taskToRowIndexMap.set(level, new Map());
    rowIndexToTaskMap.set(level, new Map());
    rowIndexToTasksMap.set(level, new Map());
    rowCounterPerLevel[level] = 0;
  }

  for (const task of tasks) {
    const comparisonLevel = task.comparisonLevel ?? 1;
    const rowIndex = rowCounterPerLevel[comparisonLevel];

    const taskToRow = taskToRowIndexMap.get(comparisonLevel)!;
    const rowToTask = rowIndexToTaskMap.get(comparisonLevel)!;
    const rowToTasks = rowIndexToTasksMap.get(comparisonLevel)!;

    const { id, parent } = task;
    const parentTask = parent ? parentMap.get(parent) : null;

    if (
      isGrouped &&
      comparisonLevel === 1 &&
      parent &&
      parentTask &&
      parentTask.hideChildren
    ) {
      const parentRow = taskToRow.get(parent);

      if (parentRow !== undefined) {
        const existing = rowToTasks.get(parentRow) ?? [];
        rowToTasks.set(parentRow, [...existing, task]);
        taskToRow.set(id, parentRow);
        continue;
      }
    }

    taskToRow.set(id, rowIndex);
    rowToTask.set(rowIndex, task);
    rowToTasks.set(rowIndex, [task]);

    const globalIndex = rowIndex * comparisonLevels + (comparisonLevel - 1);
    mapGlobalRowIndexToTask.set(globalIndex, task);

    rowCounterPerLevel[comparisonLevel]++;
  }

  return [
    taskToRowIndexMap,
    rowIndexToTaskMap,
    mapGlobalRowIndexToTask,
    rowIndexToTasksMap
  ];
};
