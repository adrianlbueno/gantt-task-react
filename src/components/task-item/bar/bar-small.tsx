import React, { useCallback } from "react";
import type { TaskItemProps } from "../task-item";
import { BarDisplay } from "./bar-display";
import stylesRelationHandle from "./bar-relation-handle.module.css";
import { BarMoveAction } from "../../../types/public-types";
import { BarDateHandle } from "./bar-date-handle";
import styles from "./bar.module.css";

export const BarSmall: React.FC<
  TaskItemProps & {
    onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
  }
> = ({
  children: relationhandles,
  colorStyles,
  distances: { barCornerRadius, handleWidth },
  hasChildren,
  isSelected,
  isCritical,
  isDateChangeable,
  onTaskEventStart,
  progressWidth,
  progressX,
  taskYOffset,
  task,
  taskHeight,
  x1,
}) => {
    const startMoveFullTask = useCallback(
      (clientX: number) => {
        onTaskEventStart("move", clientX);
      },
      [onTaskEventStart]
    );
    const startMoveEndOfTask = useCallback(
      (clientX: number) => {
        onTaskEventStart("end", clientX);
      },
      [onTaskEventStart]
    );

    return (
      <g
        className={`${styles.barWrapper} ${stylesRelationHandle.barRelationHandleWrapper}`}
        tabIndex={0}
      >
        <BarDisplay
          imageUrl={task.imageUrl}
          taskName={task.name}
          barCornerRadius={barCornerRadius}
          hasChildren={hasChildren}
          height={taskHeight}
          isCritical={isCritical}
          isSelected={isSelected}
          progressWidth={progressWidth}
          progressX={progressX}
          startMoveFullTask={startMoveFullTask}
          styles={colorStyles}
          width={handleWidth * 2}
          x={x1}
          y={taskYOffset}
        />

        {/* right */}
        {isDateChangeable && (
          <BarDateHandle
            dataTestid={`task-date-handle-right-${task.name}`}
            barCornerRadius={barCornerRadius}
            height={taskHeight - 2}
            startMove={startMoveEndOfTask}
            width={handleWidth}
            x={x1 + handleWidth}
            y={taskYOffset + 1}
          />
        )}

        {relationhandles}
      </g>
    );
  };
