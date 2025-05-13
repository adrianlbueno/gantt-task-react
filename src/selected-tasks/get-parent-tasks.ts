import { checkIsDescendant } from "../helpers/check-is-descendant";
import { isRealTask } from "../helpers/check-is-real-task";

import type {
  TaskMapByLevel,
  TaskOrEmpty,
} from "../types/public-types";

export const getParentTasks = (
  selectedTasks: TaskOrEmpty[],
  tasksMap: TaskMapByLevel,
) => {
  const res: TaskOrEmpty[] = [];

  selectedTasks.forEach((maybeDescendant) => {
    let isDescendant = selectedTasks.some((maybeParent) => {
      if (maybeParent === maybeDescendant || maybeParent.type === 'empty') {
        return false;
      }
      return isRealTask(maybeParent) &&
        checkIsDescendant(maybeParent, maybeDescendant, tasksMap);
    });

    if (!isDescendant) {
      res.push(maybeDescendant);
    }
  });

  return res;
};
