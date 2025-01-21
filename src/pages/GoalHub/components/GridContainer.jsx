import React from 'react';
import { Grid } from '@mui/material';
import ProgressCircle from './ProgressCircle';
import TimeOverview from './TimeOverview';
import StatusOverview from './StatusOverview';

const GridContainer = ({ goal }) => {
  // Get the actual progress percentage from goal data
  const getOverallProgress = () => {
    return goal?.progress_percentage || 0;
  };

  const getNextDueDate = () => {
    return goal?.end_date ? new Date(goal.end_date) : null;
  };

  const getTasksStats = () => {
    return {
      total: goal?.total_tasks || 0,
      completed: goal?.completed_tasks || 0,
      inProgress: (goal?.total_tasks || 0) - (goal?.completed_tasks || 0)
    };
  };

  const getMilestoneStats = () => {
    return {
      total: goal?.total_milestones || 0,
      completed: goal?.completed_milestones || 0,
      inProgress: (goal?.total_milestones || 0) - (goal?.completed_milestones || 0)
    };
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <ProgressCircle progress={getOverallProgress()} />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <TimeOverview goal={goal} />
      </Grid>
      <Grid item xs={12} lg={4}>
        <StatusOverview goal={goal} />
      </Grid>
    </Grid>
  );
};

export default GridContainer;