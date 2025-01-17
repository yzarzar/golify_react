import React from "react";
import GoalCard from "./GoalCard";

const GoalList = ({ goals, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default GoalList;
