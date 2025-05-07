import type {
  GlobalRowIndexToTaskMap,
  RowIndexToTaskMap,
  TaskToRowIndexMap,
  TaskOrEmpty,
} from "../types/public-types";

/**
 * @param sortedTasks Sorted list of visible tasks
 * @param comparisonLevels Number of comparison levels
 */
export const getMapTaskToRowIndex = (
  visibleTasks: readonly TaskOrEmpty[],
  comparisonLevels: number
): [TaskToRowIndexMap, RowIndexToTaskMap, GlobalRowIndexToTaskMap] => {
  const taskToRowIndexRes = new Map<number, Map<string, number>>();
  const rowIndexToTaskRes = new Map<number, Map<number, TaskOrEmpty>>();
  const globalIndexToTaskRes = new Map<number, TaskOrEmpty>();

  const groupKeyToRowIndex = new Map<string, number>();
  let nextRowIndex = 0;

  visibleTasks.forEach((task) => {
    const { id, parent, comparisonLevel = 1 } = task;

    const groupKey = task.rowIndex !== undefined
      ? `${comparisonLevel}-custom-${task.rowIndex}`
      : parent || id;

    if (!groupKeyToRowIndex.has(groupKey)) {
      groupKeyToRowIndex.set(groupKey, nextRowIndex++);
    }

    const index = groupKeyToRowIndex.get(groupKey)!;

    const indexesMapByLevel = taskToRowIndexRes.get(comparisonLevel) || new Map();
    indexesMapByLevel.set(id, index);
    taskToRowIndexRes.set(comparisonLevel, indexesMapByLevel);

    const rowIndexToTaskAtLevelMap = rowIndexToTaskRes.get(comparisonLevel) || new Map();
    rowIndexToTaskAtLevelMap.set(index, task);
    rowIndexToTaskRes.set(comparisonLevel, rowIndexToTaskAtLevelMap);

    const absoluteIndex = index * comparisonLevels + (comparisonLevel - 1);
    globalIndexToTaskRes.set(absoluteIndex, task);
  });

  return [taskToRowIndexRes, rowIndexToTaskRes, globalIndexToTaskRes];
};
