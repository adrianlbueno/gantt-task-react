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
      comparisonLevel:1
    },
    {
      id: "vacation-1-2",
      type: "vacation",
      name: "Vacation 1",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      progress: 0,
      styles: {
        barBackgroundColor: "#808080",
      },
      parent: "user-1",
      comparisonLevel:2
    },
    {
      id: "audit-2",
      type: "task",
      name: "Audit 2 last in the list",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
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
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      progress: 30,
      parent: "user-1",
    },
    {
      id: "audit-4",
      type: "task",
      name: "Audit 3",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
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
      type: "empty",
      name: "Project one",
      displayOrder: 4,
      hideChildren: true,
    },
    {
      id: "Project-new",
      type: "task",
      name: "testing project",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "ProjectId",
      hideChildren: false
    },
    {
      id: "Project-new-2",
      type: "task",
      name: "testing project 2",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "ProjectId",
      hideChildren: false
    },
    {
      id: "Project-new-3",
      type: "task",
      name: "testing project 3",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "ProjectId",
      hideChildren: false
    },
    {
      id: "user-2",
      type: "user",
      name: "Pedro Bueno",
      hideChildren: true,
    },
    {
      id: "Project-new-1-Puser-2",
      type: "task",
      name: "testing project 5",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-2",
      hideChildren: false
    },
    {
      id: "user-3",
      type: "user",
      name: "Pedro Testing",
      hideChildren: true,
    },
    {
      id: "Project-new-1-Puser-3",
      type: "task",
      name: "testing project 3",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-3",
      hideChildren: false
    },
    {
      id: "user-4",
      type: "user",
      name: "Pedro Testing",
      hideChildren: true,
    },
    {
      id: "Project-new-1-Puser-4",
      type: "task",
      name: "testing project 4",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-4",
      hideChildren: false
    },
    {
      id: "Project-new-1-Puser-5",
      type: "task",
      name: "testing project 5",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-4",
      hideChildren: false
    },
    {
      id: "user-5",
      type: "user",
      name: "Xavier Testing",
      hideChildren: true,
    },
    {
      id: "Project-new-1-Puser-5",
      type: "task",
      name: "testing project 4",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-5",
      hideChildren: false
    },
    {
      id: "Project-new-1-Puser-5",
      type: "task",
      name: "testing project 5",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-5",
      hideChildren: false
    },

    {
      id: "user-6",
      type: "user",
      name: "Xavier Testing",
      hideChildren: true,
    },
    {
      id: "Project-new-1-Puser-6",
      type: "task",
      name: "testing project 4",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-6",
      hideChildren: false
    },
    {
      id: "Project-new-1-Puser-6",
      type: "task",
      name: "testing project 5",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-6",
      hideChildren: false
    },
    {
      id: "user-7",
      type: "user",
      name: "Xavier Testing",
      hideChildren: true,
    },
    {
      id: "Project-new-1-Puser-7",
      type: "task",
      name: "testing project 4",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-7",
      hideChildren: false
    },
    {
      id: "Project-new-1-Puser-7",
      type: "task",
      name: "testing project 5",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      progress: 70,
      parent: "user-7",
      hideChildren: false
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
