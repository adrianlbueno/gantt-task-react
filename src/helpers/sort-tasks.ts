import { TaskOrEmpty } from "../types/public-types";

export const sortTasks = (taskA: TaskOrEmpty, taskB: TaskOrEmpty) => {
  const orderA = taskA.displayOrder || Number.MAX_VALUE;
  const orderB = taskB.displayOrder || Number.MAX_VALUE;

  if (orderA > orderB) {
    return 1;
  }

  if (orderA < orderB) {
    return -1;
  }

  return 0;
};

export const sortTasksByOrderThenDate = (
  taskA: TaskOrEmpty,
  taskB: TaskOrEmpty
): number => {
  const orderA = taskA.displayOrder ?? Number.MAX_VALUE;
  const orderB = taskB.displayOrder ?? Number.MAX_VALUE;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  const startA = (taskA as any).start?.getTime?.() ?? 0;
  const startB = (taskB as any).start?.getTime?.() ?? 0;
  return startA - startB;
};
