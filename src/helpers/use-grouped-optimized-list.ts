import { RefObject, useEffect, useMemo, useState } from "react"
import type { RowIndexToTasksMap } from "../types/public-types"
import { OptimizedListParams } from "./use-optimized-list"

const TASK_SPACING = 2

interface RowEntry {
    rowIndex: number
    height: number
}

interface ScrollMetrics {
    scrollTop: number
    clientHeight: number
    scrollHeight: number
}

interface VisibleRange {
    startIdx: number
    endIdx: number
    atStart: boolean
    atEnd: boolean
}

const getScrollMetrics = (containerRef: Element | null): ScrollMetrics => {

    if (!containerRef) return { scrollTop: 0, clientHeight: 0, scrollHeight: 0 };

    return {
        scrollTop: containerRef?.scrollTop ?? 0,
        clientHeight: containerRef?.clientHeight ?? 0,
        scrollHeight: containerRef?.scrollHeight ?? 0,
    }
}

const buildRowEntries = (
    rowIndexToTasksMap: RowIndexToTasksMap,
    taskHeight: number
): RowEntry[] => {
    const entries: RowEntry[] = []
    const rowToTasksCount = new Map<number, number>()

    for (const [_comparisonLevel, rowMap] of rowIndexToTasksMap.entries()) {
        for (const [rowIndex, tasks] of rowMap.entries()) {
            const currentCount = rowToTasksCount.get(rowIndex) || 0
            rowToTasksCount.set(rowIndex, currentCount + tasks.length)
        }
    }
    for (const [rowIndex, totalTasks] of rowToTasksCount.entries()) {
        const effectiveRowHeight = totalTasks * (taskHeight + TASK_SPACING)
        entries.push({ rowIndex, height: effectiveRowHeight })
    }

    return entries.sort((a, b) => a.rowIndex - b.rowIndex)
}

const calculateVisibleRange = (
    entries: RowEntry[],
    scrollTop: number,
    clientHeight: number
): VisibleRange => {
    if (entries.length === 0) {
        return {
            startIdx: 0,
            endIdx: 0,
            atStart: true,
            atEnd: true,
        }
    }

    let cumulative = 0
    let startIdx = -1
    let endIdx = -1

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const rowTop = cumulative
        const rowBottom = cumulative + entry.height

        if (startIdx === -1 && rowBottom > scrollTop) {
            startIdx = i
        }

        if (rowTop < scrollTop + clientHeight) {
            endIdx = i
        }

        cumulative += entry.height
    }

    const finalStartIdx = startIdx === -1 ? 0 : startIdx
    const finalEndIdx = endIdx === -1 ? Math.max(0, entries.length - 1) : endIdx

    return {
        startIdx: Math.max(0, finalStartIdx),
        endIdx: Math.min(entries.length - 1, finalEndIdx),
        atStart: scrollTop <= 0,
        atEnd: scrollTop + clientHeight >= cumulative,
    }
}

export const useGroupedVirtualization = (
    containerRef: RefObject<Element>,
    rowIndexToTasksMap: RowIndexToTasksMap,
    taskHeight: number
): OptimizedListParams => {

    const [scrollMetrics, setScrollMetrics] = useState(() => getScrollMetrics(containerRef.current) || { scrollTop: 0, clientHeight: 0, scrollHeight: 0 })

    const rowEntries = useMemo(
        () => buildRowEntries(rowIndexToTasksMap, taskHeight),
        [rowIndexToTasksMap, taskHeight]
    )

    const { startIdx, endIdx, atStart, atEnd } = useMemo(() =>
        calculateVisibleRange(
            rowEntries,
            scrollMetrics.scrollTop,
            scrollMetrics.clientHeight
        ), [rowEntries, scrollMetrics.scrollTop, scrollMetrics.clientHeight]
    )

    useEffect(() => {
        let rafId: number | null = null
        let prevMetrics = scrollMetrics

        const handler = () => {
            const newMetrics = getScrollMetrics(containerRef.current)

            const hasChanged =
                newMetrics.scrollTop !== prevMetrics.scrollTop ||
                newMetrics.clientHeight !== prevMetrics.clientHeight ||
                newMetrics.scrollHeight !== prevMetrics.scrollHeight

            if (hasChanged) {
                prevMetrics = newMetrics
                setScrollMetrics(newMetrics)
            }

            rafId = requestAnimationFrame(handler)
        }

        const element = containerRef.current

        if (element) {
            rafId = requestAnimationFrame(handler)
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [containerRef])

    console.log("startIdx, endIdx, atStart, atEnd, scrollMetrics.clientHeight", startIdx, endIdx, atStart, atEnd, scrollMetrics.clientHeight)

    return [startIdx, endIdx, atStart, atEnd, scrollMetrics.clientHeight]
}