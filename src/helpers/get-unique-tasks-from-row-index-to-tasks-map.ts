import { RowIndexToTasksMap, TaskOrEmpty } from "../types/public-types";

export const getUniqueTasksFromRowIndexToTasksMap = (
    rowIndexToTasksMap: RowIndexToTasksMap
): TaskOrEmpty[] => {
    const seen = new Set<string>();
    const result: TaskOrEmpty[] = [];

    for (const levelMap of rowIndexToTasksMap.values()) {
        for (const tasks of levelMap.values()) {
            for (const task of tasks) {
                if (!seen.has(task.id)) {
                    seen.add(task.id);
                    result.push(task);
                }
            }
        }
    }

    return result;
};
