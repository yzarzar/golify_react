import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const GoalCardSkeleton = () => {
  const { darkMode } = useTheme();

  const skeletonClass = darkMode ? "bg-dark-bg-tertiary" : "bg-gray-200";

  return (
    <div
      className={`p-6 rounded-lg shadow-sm transition-colors duration-theme min-h-[280px] max-w-full flex flex-col
        ${
          darkMode
            ? "border bg-dark-bg-secondary border-dark-border"
            : "bg-white border border-primary-100"
        }`}
    >
      <div className="flex gap-4 justify-between items-start mb-4">
        <div className="flex-1">
          {/* Title skeleton */}
          <div
            className={`h-6 rounded-md w-3/4 mb-3 animate-pulse ${skeletonClass}`}
          />
          <div className="flex gap-2 mt-2">
            {/* Priority badge skeleton */}
            <div
              className={`h-6 w-16 rounded-full animate-pulse ${skeletonClass} opacity-70`}
            />
            {/* Status badge skeleton */}
            <div
              className={`h-6 w-24 rounded-full animate-pulse ${skeletonClass} opacity-70`}
            />
          </div>
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-4 flex-1">
        <div
          className={`h-4 rounded-md w-full animate-pulse ${skeletonClass}`}
        />
        <div
          className={`h-4 rounded-md w-5/6 animate-pulse ${skeletonClass}`}
        />
        <div
          className={`h-4 rounded-md w-4/6 animate-pulse ${skeletonClass}`}
        />
      </div>

      <div className="mt-auto space-y-3">
        {/* Dates skeleton */}
        <div className="flex justify-between">
          <div className="space-y-1">
            <div
              className={`h-3 w-16 rounded-md animate-pulse ${skeletonClass} opacity-60`}
            />
            <div
              className={`h-4 w-24 rounded-md animate-pulse ${skeletonClass}`}
            />
          </div>
          <div className="space-y-1">
            <div
              className={`h-3 w-16 rounded-md animate-pulse ${skeletonClass} opacity-60`}
            />
            <div
              className={`h-4 w-24 rounded-md animate-pulse ${skeletonClass}`}
            />
          </div>
        </div>

        {/* Progress skeleton */}
        <div>
          <div className="flex justify-between mb-1">
            <div
              className={`h-4 w-16 rounded-md animate-pulse ${skeletonClass} opacity-70`}
            />
            <div
              className={`h-4 w-8 rounded-md animate-pulse ${skeletonClass} opacity-70`}
            />
          </div>
          <div
            className={`h-2 rounded-full w-full animate-pulse ${
              darkMode ? "bg-dark-bg-primary" : "bg-gray-300"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default GoalCardSkeleton;
