import endOfDay from "date-fns/endOfDay";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import startOfDay from "date-fns/startOfDay";
import startOfMinute from "date-fns/startOfMinute";

import { EmptyTask, Task, TaskOrEmpty } from "../src";

const dateFormat = "dd/MM/yyyy HH:mm";

export function initTasksUser(): TaskOrEmpty[] {
  const currentDate = new Date();
  const tasks: TaskOrEmpty[] = [
    {
      id: "user-1",
      type: "user",
      name: "Adrian Bueno",
      hideChildren: true,
    },
    {
      id: "audit-1",
      type: "task",
      name: "Audit 1 first in the list",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      progress: 50,
      parent: "user-1",
    },
    {
      id: "audit-2",
      type: "task",
      name: "Audit 2 last in the list",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 50,
      parent: "user-1",
    },
    {
      id: "audit-3",
      type: "task",
      name: "Audit 2",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 30,
      parent: "user-1",
    },
    {
      id: "audit-unique",
      type: "task",
      name: "new task",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 30,
      parent: "user-1",
    },
    {
      id: "audit-4",
      type: "task",
      name: "Audit 3",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      progress: 70,
      parent: "user-1",
    },
    {
      id: "emptyTask",
      name: "EmptyTask",
      type: "empty",
      hideChildren: false,
    },

    {
      id: "audit-4 no dates",
      type: "task",
      name: "Audit testing",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 70,
      parent: "user-1",
    },
    {
      id: "ProjectId",
      type: "project",
      name: "Project one",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 70,
      displayOrder: 4,
      hideChildren: false
    },
    {
      id: "ProjectIdcandoit",
      type: "project",
      name: "Project two",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 70,
      displayOrder: 4,
      hideChildren: false
    },
    {
      id: "user-cool",
      type: "user",
      name: "Tester Bueno",
      hideChildren: true,
    },
    {
      id: "ProjectId-user-cool",
      type: "task",
      name: "Project one",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 70,
      displayOrder: 4,
      hideChildren: false,
      parent: "user-cool"
    },
    {
      id: "user-cooler",
      type: "user",
      name: "Tester Bueno",
      hideChildren: true,
    },
    {
      id: "ProjectId-user-cooler",
      type: "task",
      name: "Development",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 70,
      displayOrder: 4,
      hideChildren: false,
      parent: "user-cooler"
    },
    {
      id: "user-coolerer",
      type: "user",
      name: "Tester Bueno",
      hideChildren: true,
    },
    {
      id: "ProjectId-user-cooleerrr",
      type: "task",
      name: "Testing coolerere",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 70,
      displayOrder: 4,
      hideChildren: false,
      parent: "user-coolerer"
    },
    {
      id: "user-adrian",
      type: "user",
      name: "Leonardo Bueno",
      hideChildren: true,
    },
    {
      id: "ProjectId-user-adrian",
      type: "task",
      name: "Testing coolerere",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      progress: 70,
      displayOrder: 4,
      hideChildren: false,
      parent: "user-adrian"
    },
    {
      id: "user-1-final",
      type: "user",
      name: "Adrian Bueno",
      hideChildren: true,
    },
    {
      id: "audit-1-final",
      type: "task",
      name: "final one",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      progress: 50,
      parent: "user-1-final",
    },
    {
      id: "user-1-final.test",
      type: "user",
      name: "Adrian Buenooe",
      hideChildren: true,
    },
    {
      id: "audit-1-final.testing",
      type: "task",
      name: "final one",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      progress: 50,
      parent: "user-1-final.test",
    },
    {
      id: "audit-1-final-vacation",
      type: "vacation",
      name: "vacation thing",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      progress: 50,
      parent: "user-1-final.test",
    },
  ];

  return tasks.map(taskOrEmpty => {
    if ("start" in taskOrEmpty && "end" in taskOrEmpty) {
      const task = taskOrEmpty as Task;
      return {
        ...task,
        start: startOfDay(task.start),
        end: endOfDay(task.end)
      };
    }
    // Return the task as-is if it doesn't have 'start' and 'end'
    return taskOrEmpty;
  });
}


export const getTaskFields = (initialValues: {
  name?: string;
  start?: Date | null;
  end?: Date | null;
}) => {
  const name = prompt("Name", initialValues.name);

  const startDateStr =
    prompt(
      "Start date",
      initialValues.start ? format(initialValues.start, dateFormat) : ""
    ) || "";

  const startDate = startOfMinute(parse(startDateStr, dateFormat, new Date()));

  const endDateStr =
    prompt(
      "End date",
      initialValues.end ? format(initialValues.end, dateFormat) : ""
    ) || "";

  const endDate = startOfMinute(parse(endDateStr, dateFormat, new Date()));

  return {
    name,
    start: isValid(startDate) ? startDate : null,
    end: isValid(endDate) ? endDate : null
  };
};

export const onAddTask = (parentTask: Task) => {
  const taskFields = getTaskFields({
    start: parentTask.start,
    end: parentTask.end
  });

  const nextTask: TaskOrEmpty =
    taskFields.start && taskFields.end
      ? {
        type: "task",
        start: taskFields.start,
        end: taskFields.end,
        comparisonLevel: parentTask.comparisonLevel,
        id: String(Date.now()),
        name: taskFields.name || "",
        progress: 0,
        parent: parentTask.id,
        styles: parentTask.styles
      }
      : {
        type: "empty",
        comparisonLevel: parentTask.comparisonLevel,
        id: String(Date.now()),
        name: taskFields.name || "",
        parent: parentTask.id,
        styles: parentTask.styles
      };

  return Promise.resolve(nextTask);
};

export const onEditTask = (task: TaskOrEmpty) => {
  const taskFields = getTaskFields({
    name: task.name,
    start: task.type === "empty" ? null : (task as Task).start,
    end: task.type === "empty" ? null : (task as Task).end
  });

  let nextTask: TaskOrEmpty;
  if (task.type === "task" || task.type === "empty") {
    nextTask = taskFields.start && taskFields.end
      ? {
        type: "task",
        start: taskFields.start,
        end: taskFields.end,
        comparisonLevel: task.comparisonLevel,
        id: task.id,
        name: taskFields.name || task.name,
        progress: task.type === "empty" ? 0 : (task as Task).progress,
        dependencies: task.type === "empty" ? undefined : (task as Task).dependencies,
        parent: task.parent,
        styles: task.styles,
        isDisabled: task.isDisabled
      }
      : {
        type: "empty",
        comparisonLevel: task.comparisonLevel,
        id: task.id,
        name: taskFields.name || task.name,
        parent: task.parent,
        styles: task.styles,
        isDisabled: task.isDisabled
      } as EmptyTask;
  } else {
    nextTask = {
      ...task,
      name: taskFields.name || task.name,
      start: taskFields.start || (task as Task).start,
      end: taskFields.end || (task as Task).end
    } as Task;
  }

  return Promise.resolve(nextTask);
};
