import { TaskOrEmpty } from "../types/public-types";

export const sortVisibleUserTasks = (tasks: TaskOrEmpty[]) => {

    const result: TaskOrEmpty[] = [];

    const byParent: Record<string, TaskOrEmpty[]> = {};


    for (const task of tasks) {
        const parentId = task.parent || "__root__";
        byParent[parentId] = [...(byParent[parentId] ?? []), task];
    }

    function appendTasksRecursively(parentId: string) {
        const children = (byParent[parentId] ?? []).sort(
            (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        for (const child of children) {
            result.push(child);
            if ("hideChildren" in child && child.hideChildren === false) {
                appendTasksRecursively(child.id);
            }
        }
    }

    appendTasksRecursively("__root__");
    return result;



}