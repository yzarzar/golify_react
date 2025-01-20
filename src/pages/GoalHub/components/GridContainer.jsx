import React from 'react';
import { Grid } from '@mui/material';
import ProgressCircle from './ProgressCircle';
import TimeOverview from './TimeOverview';
import StatusOverview from './StatusOverview';

const GridContainer = ({ milestones }) => {
  const getAllTasks = () => {
    return milestones.flatMap(milestone => milestone.tasks || []);
  };

  const getOverallProgress = () => {
    const tasks = getAllTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getNextDueDate = () => {
    const milestoneDates = milestones
      .filter(m => m.dueDate)
      .map(m => new Date(m.dueDate));
    
    const taskDates = getAllTasks()
      .filter(t => !t.completed && t.dueDate)
      .map(t => new Date(t.dueDate));
    
    const allDates = [...milestoneDates, ...taskDates];
    
    if (allDates.length === 0) return null;
    return new Date(Math.min(...allDates));
  };

  const getTasksStats = () => {
    const tasks = getAllTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  };

  const getMilestoneStats = () => {
    const total = milestones.length;
    const completed = milestones.filter(m => {
      const milestoneTasks = m.tasks || [];
      return milestoneTasks.length > 0 && 
             milestoneTasks.every(t => t.completed);
    }).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <ProgressCircle progress={getOverallProgress()} />
      </Grid>
      <Grid item xs={12} md={4}>
        <TimeOverview nextDueDate={getNextDueDate()} />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatusOverview
          taskStats={getTasksStats()}
          milestoneStats={getMilestoneStats()}
        />
      </Grid>
    </Grid>
  );
};

export default GridContainer;