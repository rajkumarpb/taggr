import React, { useState } from "react";
import TaskProgress from "../molecules/TaskProgress";
import Filter from "./Filter";

const Header = ({
  task: {
    isOngoing: isTaskOngoing = true,
    name: taskName = "not defined ",
    percentage: taskPercentage = 0,
  },
  onFilterChange,
}) => {
  return isTaskOngoing ? (
    <TaskProgress name={taskName} percentage={taskPercentage} />
  ) : (
    <Filter onFilterChange={onFilterChange} />
  );
};

export default Header;