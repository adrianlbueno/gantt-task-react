import { Task, TaskOrEmpty } from "../types/public-types";

export function isRealTask(task: TaskOrEmpty): task is Task {
    return task.type === "task" || task.type === "milestone" || task.type === "project" || task.type === "user";
}
