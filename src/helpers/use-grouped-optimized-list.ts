import { useMemo } from "react";
import type { RowIndexToTasksMap } from "../types/public-types";
import { OptimizedListParams } from "./use-optimized-list";

/*const TASK_SPACING = 2

interface RowEntry {
    rowIndex: number
    height: number
}*/

/*interface ScrollMetrics {
    scrollTop: number
    clientHeight: number
    scrollHeight: number
}
*/
/*
const getScrollMetrics = (el: HTMLElement | null): ScrollMetrics => {
    return {
        scrollTop: el?.scrollTop ?? 0,
        clientHeight: el?.clientHeight ?? 0,
        scrollHeight: el?.scrollHeight ?? 0,
    }
}
*/

/*
const buildRowEntries = (
    rowIndexToTasksMap: RowIndexToTasksMap,
    taskHeight: number
): RowEntry[] => {
    const rowToTaskCount = new Map<number, number>()

    for (const rowMap of rowIndexToTasksMap.values()) {
        for (const [rowIndex, tasks] of rowMap.entries()) {
            rowToTaskCount.set(rowIndex, (rowToTaskCount.get(rowIndex) ?? 0) + tasks.length)
        }
    }

    return [...rowToTaskCount.entries()]
        .map(([rowIndex, count]) => ({
            rowIndex,
            height: count * (taskHeight + TASK_SPACING)
        }))
        .sort((a, b) => a.rowIndex - b.rowIndex)
}*/

{/*
const calculateVisibleRange = (
    entries: RowEntry[],
    scrollTop: number,
    clientHeight: number
) => {
    let startIdx = -1, endIdx = -1, cumulative = 0;

    for (let i = 0; i < entries.length; i++) {
        const { height } = entries[i];
        const rowTop = cumulative;
        const rowBottom = cumulative + height;

        if (startIdx === -1 && rowBottom > scrollTop) {
            startIdx = i;
        }

        if (rowTop < scrollTop + clientHeight) {
            endIdx = i;
        }

        cumulative += height;
    }

    if (
        endIdx < entries.length - 1 &&
        cumulative < scrollTop + clientHeight
    ) {
        endIdx++;
    }

    const s = Math.max(0, startIdx === -1 ? 0 : startIdx);
    const e = Math.min(entries.length - 1, endIdx === -1 ? entries.length - 1 : endIdx);

    return {
        startRow: entries[s]?.rowIndex ?? 0,
        endRow: entries[e]?.rowIndex ?? 0,
        atStart: scrollTop <= 0,
        atEnd: scrollTop + clientHeight >= cumulative,
        clientHeight
    };
#};
*/}

export const useGroupedVirtualization = (
    rowIndexToTasksMap: RowIndexToTasksMap,
    taskHeight: number
): OptimizedListParams => {
    const rowEntries = useMemo(() => {
        const rowToHeight = new Map<number, number>();
        for (const levelMap of rowIndexToTasksMap.values()) {
            for (const [rowIndex, tasks] of levelMap.entries()) {
                const height = tasks.length * (taskHeight + 2); // spacing
                rowToHeight.set(rowIndex, (rowToHeight.get(rowIndex) ?? 0) + height);
            }
        }

        return [...rowToHeight.entries()]
            .map(([rowIndex, height]) => ({ rowIndex, height }))
            .sort((a, b) => a.rowIndex - b.rowIndex);
    }, [rowIndexToTasksMap, taskHeight]);

    return [
        rowEntries[0]?.rowIndex ?? 0,
        rowEntries[rowEntries.length - 1]?.rowIndex ?? 0,
        true,
        true,
        rowEntries.reduce((sum, entry) => sum + entry.height, 0)
    ];
};
