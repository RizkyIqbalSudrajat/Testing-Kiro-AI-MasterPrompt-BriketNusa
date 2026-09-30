import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* 4 Stat Cards Shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-stone-200/50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-stone-300 dark:bg-stone-700 rounded-md" />
              <div className="w-8 h-8 rounded-2xl bg-stone-300 dark:bg-stone-700" />
            </div>
            <div className="h-7 w-36 bg-stone-300 dark:bg-stone-700 rounded-lg" />
            <div className="flex justify-between pt-2 border-t border-stone-200/60 dark:border-stone-800">
              <div className="h-3 w-20 bg-stone-300 dark:bg-stone-700 rounded-md" />
              <div className="h-3 w-14 bg-stone-300 dark:bg-stone-700 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Bento Middle Row Shimmer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-stone-200/50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-4 h-80">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-stone-300 dark:bg-stone-700 rounded-md" />
              <div className="h-5 w-48 bg-stone-300 dark:bg-stone-700 rounded-lg" />
            </div>
            <div className="h-7 w-32 bg-stone-300 dark:bg-stone-700 rounded-xl" />
          </div>
          <div className="h-52 w-full bg-stone-300/60 dark:bg-stone-700/50 rounded-2xl" />
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-stone-200/50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-4 h-80">
          <div className="h-4 w-32 bg-stone-300 dark:bg-stone-700 rounded-md" />
          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className="h-16 w-full bg-stone-300/60 dark:bg-stone-700/50 rounded-2xl"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Table Shimmer */}
      <div className="p-6 rounded-3xl bg-stone-200/50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-44 bg-stone-300 dark:bg-stone-700 rounded-md" />
          <div className="h-7 w-40 bg-stone-300 dark:bg-stone-700 rounded-xl" />
        </div>
        <div className="space-y-2 pt-2">
          {[...Array(4)].map((_, k) => (
            <div
              key={k}
              className="h-12 w-full bg-stone-300/60 dark:bg-stone-700/50 rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
