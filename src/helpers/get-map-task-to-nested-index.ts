import {
  ChildByLevelMap,
  MapTaskToNestedIndex,
  RootMapByLevel,
  TaskOrEmpty,
} from "../types/public-types";

const setIndex = (
  map: MapTaskToNestedIndex,
  level: number,
  id: string,
  depth: number,
  indexStr: string
) => {
  if (!map.has(level)) {
    map.set(level, new Map());
  }
  map.get(level)!.set(id, [depth, indexStr]);
};

const walkTasks = (
  map: MapTaskToNestedIndex,
  comparisonLevel: number,
  parentId: string,
  depth: number,
  prefix: string,
  childTasksMap: Map<string, TaskOrEmpty[]>
) => {
  const children = childTasksMap.get(parentId);
  if (!children) return;

  children.forEach((child, i) => {
    const indexStr = `${prefix}.${i + 1}`;
    setIndex(map, comparisonLevel, child.id, depth, indexStr);
    walkTasks(map, comparisonLevel, child.id, depth + 1, indexStr, childTasksMap);
  });
};

export const getMapTaskToNestedIndex = (
  childTasksMap: ChildByLevelMap,
  rootTasksMap: RootMapByLevel
): MapTaskToNestedIndex => {
  const map: MapTaskToNestedIndex = new Map();

  for (const [comparisonLevel, rootTasks] of rootTasksMap.entries()) {
    const childMap = childTasksMap.get(comparisonLevel) ?? new Map();

    rootTasks.forEach((task, i) => {
      const indexStr = `${i + 1}`;
      setIndex(map, comparisonLevel, task.id, 0, indexStr);
      walkTasks(map, comparisonLevel, task.id, 1, indexStr, childMap);
    });
  }
  return map;
};
