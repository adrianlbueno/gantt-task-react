import { useMemo } from "react";
import type { RowIndexToTasksMap } from "../types/public-types";
import type { OptimizedListParams } from "./use-optimized-list";

const TASK_SPACING = 2;

interface RowEntry {
    rowIndex: number;
    height: number;
}

export const useGroupedVirtualization = (
    _containerRef: React.RefObject<HTMLElement>,
    rowIndexToTasksMap: RowIndexToTasksMap,
    taskHeight: number
): OptimizedListParams => {
    const rowEntries: RowEntry[] = useMemo(() => {
        if (!rowIndexToTasksMap || rowIndexToTasksMap.size === 0) return [];

        const rowToHeight = new Map<number, number>();

        for (const levelMap of rowIndexToTasksMap.values()) {
            for (const [rowIndex, tasks] of levelMap.entries()) {
                const height = tasks.length * (taskHeight + TASK_SPACING);
                rowToHeight.set(rowIndex, (rowToHeight.get(rowIndex) ?? 0) + height);
            }
        }

        return [...rowToHeight.entries()]
            .map(([rowIndex, height]) => ({ rowIndex, height }))
            .sort((a, b) => a.rowIndex - b.rowIndex);
    }, [rowIndexToTasksMap, taskHeight]);

    if (!rowEntries || rowEntries.length === 0) {
        return [0, 0, true, true, 0];
    }

    const first = rowEntries[0];
    const last = rowEntries[rowEntries.length - 1];
    const fullHeight = rowEntries.reduce((sum, r) => sum + r.height, 0);

    return [
        first?.rowIndex ?? 0,
        last?.rowIndex ?? 0,
        true,
        true,
        fullHeight
    ];
};

