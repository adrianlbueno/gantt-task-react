import { GlobalRowIndexToTaskMap, RowIndexToTaskMap, RowIndexToTasksMap, TaskOrEmpty, TaskToRowIndexMap } from "../types/public-types";

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

  const parentMap = new Map(tasks.map((t) => [t.id, t]));

  let globalRowIndex = 0;

  for (let comparisonLevel = 1; comparisonLevel <= comparisonLevels; comparisonLevel++) {
    const taskToRow = new Map<string, number>();
    const rowToTask = new Map<number, TaskOrEmpty>();
    const rowToTasks = new Map<number, TaskOrEmpty[]>();

    taskToRowIndexMap.set(comparisonLevel, taskToRow);
    rowIndexToTaskMap.set(comparisonLevel, rowToTask);
    rowIndexToTasksMap.set(comparisonLevel, rowToTasks);

    let rowIndex = 0;

    for (const task of tasks) {
      if ((task.comparisonLevel ?? 1) !== comparisonLevel) continue;

      const { id, parent, type } = task;

      let assignedRowIndex = rowIndex;

      if (type === "user" || type === "project") {
        taskToRow.set(id, rowIndex);
        rowToTask.set(rowIndex, task);
        rowToTasks.set(rowIndex, [task]);
        mapGlobalRowIndexToTask.set(globalRowIndex, task);

        rowIndex++;
        globalRowIndex++;
        continue;
      }

      if (isGrouped && parent) {
        const parentTask = parentMap.get(parent);
        const parentRowIndex = taskToRow.get(parent);

        if (parentTask?.hideChildren && parentRowIndex !== undefined) {
          assignedRowIndex = parentRowIndex;
        } else {
          assignedRowIndex = rowIndex;
          rowIndex++;
        }
      } else {
        assignedRowIndex = rowIndex;
        rowIndex++;
      }

      taskToRow.set(id, assignedRowIndex);
      rowToTask.set(assignedRowIndex, task);
      const existing = rowToTasks.get(assignedRowIndex) ?? [];
      rowToTasks.set(assignedRowIndex, [...existing, task]);
      mapGlobalRowIndexToTask.set(globalRowIndex, task);
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
