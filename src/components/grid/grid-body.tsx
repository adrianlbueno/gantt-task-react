import { ReactNode, memo, useMemo } from "react";
import { getDatesDiff } from "../../helpers/get-dates-diff";

import React from "react";
import { shouldDrawVerticalDivider } from "../../helpers/time-unit-boundaries";
import type { DateExtremity, ViewMode } from "../../types/public-types";

export type GridBodyProps = {
  additionalLeftSpace: number;
  columnWidth: number;
  ganttFullHeight: number;
  isUnknownDates: boolean;
  startDate: Date;
  todayColor: string;
  holidayBackgroundColor: string;
  rtl: boolean;
  viewMode: ViewMode;
  startColumnIndex: number;
  endColumnIndex: number;
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean;
  getDate: (index: number) => Date;
  minTaskDate: Date;
  dividerColor: string;
};

const GridBodyInner: React.FC<GridBodyProps> = ({
  additionalLeftSpace,
  columnWidth,
  ganttFullHeight,
  isUnknownDates,
  todayColor,
  rtl,
  startDate,
  viewMode,
  dividerColor,
  startColumnIndex,
  endColumnIndex,
  getDate
}) => {

  const today = useMemo(() => {
    if (isUnknownDates) {
      return null;
    }

    const todayIndex = getDatesDiff(new Date(), startDate, viewMode);

    const tickX = todayIndex * columnWidth;

    const x = rtl ? tickX + columnWidth : tickX;

    return (
      <rect
        x={additionalLeftSpace + x}
        y={0}
        width={columnWidth}
        height={ganttFullHeight}
        fill={todayColor}
      />
    );
  }, [
    additionalLeftSpace,
    columnWidth,
    ganttFullHeight,
    isUnknownDates,
    rtl,
    startDate,
    todayColor,
    viewMode,
  ]);

  const verticalDividers = useMemo(() => {
    const dividers: ReactNode[] = [];

    for (let i = startColumnIndex; i <= endColumnIndex; i++) {
      const currentDate = getDate(i);
      const previousDate = i > startColumnIndex ? getDate(i - 1) : null;

      if (shouldDrawVerticalDivider(
        currentDate,
        previousDate,
        viewMode,
        isUnknownDates,
        i,
        startColumnIndex
      )) {

        const x = additionalLeftSpace + columnWidth * i;

        console.log("debugging x:", x);
        console.log("divider color", dividerColor)
        dividers.push(
          <line
            key={`divider-${i}`}
            x1={x}
            x2={x}
            y1={0}
            y2={ganttFullHeight}
            stroke={dividerColor}
            opacity={0.15}
            strokeWidth={2}
          />
        );
      }
    }

    return dividers;
  }, [
    additionalLeftSpace,
    columnWidth,
    ganttFullHeight,
    viewMode,
    isUnknownDates,
    startColumnIndex,
    endColumnIndex,
    getDate,
    dividerColor
  ]);

  console.log('verticalDividers :>> ', verticalDividers);
  return (
    <g className="gridBody">
      <g className="today">{today}</g>
      <g className="verticalDividers">{verticalDividers}</g>

    </g>
  );
};

export const GridBody = memo(GridBodyInner);
