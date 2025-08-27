import { ViewMode } from "..";

export const shouldDrawVerticalDivider = (
    currentDate: Date,
    previousDate: Date | null,
    viewMode: ViewMode,
    isUnknownDates: boolean,
    columnIndex: number,
    startColumnIndex: number
): boolean => {
    if (isUnknownDates) return false;
    if (columnIndex === startColumnIndex) return true;
    if (!previousDate) return false;

    switch (viewMode) {
        case ViewMode.Year:
            // Divider at year change
            return currentDate.getFullYear() !== previousDate.getFullYear();

        case ViewMode.HalfYear:
            const currentHalf = Math.ceil((currentDate.getMonth() + 1) / 6);
            const previousHalf = Math.ceil((previousDate.getMonth() + 1) / 6);
            return (
                currentHalf !== previousHalf ||
                currentDate.getFullYear() !== previousDate.getFullYear()
            );

        case ViewMode.QuarterYear:
            return (
                Math.ceil((currentDate.getMonth() + 1) / 3) !==
                Math.ceil((previousDate.getMonth() + 1) / 3) ||
                currentDate.getFullYear() !== previousDate.getFullYear()
            );

        case ViewMode.Month:
            // Divider at month change
            return (
                currentDate.getMonth() !== previousDate.getMonth() ||
                currentDate.getFullYear() !== previousDate.getFullYear()
            );

        case ViewMode.Week:
            // Divider at month change
            return (
                currentDate.getMonth() !== previousDate.getMonth() ||
                currentDate.getFullYear() !== previousDate.getFullYear()
            );

        case ViewMode.Day:
            // Divider at day change
            return currentDate.getDate() !== previousDate.getDate() ||
                currentDate.getMonth() !== previousDate.getMonth() ||
                currentDate.getFullYear() !== previousDate.getFullYear();

        case ViewMode.HalfDay:
        case ViewMode.QuarterDay:
        case ViewMode.Hour:
            // Divider at new day (so smaller units still align with days)
            return currentDate.getDate() !== previousDate.getDate() ||
                currentDate.getMonth() !== previousDate.getMonth() ||
                currentDate.getFullYear() !== previousDate.getFullYear();

        default:
            return false;
    }
};
