import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DragDropContext } from 'react-beautiful-dnd';
import GoalHeader from './components/GoalHeader';
import GridContainer from './components/GridContainer';
import Milestone from './components/Milestone';

const GoalHub = () => {
  const [milestones, setMilestones] = useState([
    { 
      id: 1, 
      title: 'Research Phase', 
      completed: true,
      dueDate: '2024-02-15',
      expanded: true,
      priority: 'High',
      description: 'Complete market research and competitor analysis'
    },
    { 
      id: 2, 
      title: 'Implementation', 
      completed: false,
      dueDate: '2024-03-01',
      expanded: true,
      priority: 'Medium',
      description: 'Implement core features and functionality'
    },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Market Research', completed: true, milestoneId: 1, dueDate: '2024-02-10', priority: 'High' },
    { id: 2, title: 'Competitor Analysis', completed: true, milestoneId: 1, dueDate: '2024-02-12', priority: 'Medium' },
    { id: 3, title: 'Setup Development Environment', completed: false, milestoneId: 2, dueDate: '2024-02-20', priority: 'High' },
    { id: 4, title: 'Create Initial Prototype', completed: false, milestoneId: 2, dueDate: '2024-02-25', priority: 'Medium' },
  ]);

  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingMilestoneField, setEditingMilestoneField] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskField, setEditingTaskField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleMilestoneEdit = (id, field, value) => {
    setEditingMilestoneId(id);
    setEditingMilestoneField(field);
    setEditValue(value);
  };

  const handleTaskEdit = (id, field, value) => {
    setEditingTaskId(id);
    setEditingTaskField(field);
    setEditValue(value);
  };

  const handleMilestoneEditComplete = () => {
    if (editingMilestoneId && editingMilestoneField) {
      setMilestones(milestones.map(m => 
        m.id === editingMilestoneId 
          ? { ...m, [editingMilestoneField]: editValue }
          : m
      ));
    }
    setEditingMilestoneId(null);
    setEditingMilestoneField(null);
    setEditValue('');
  };

  const handleTaskEditComplete = () => {
    if (editingTaskId && editingTaskField) {
      setTasks(tasks.map(t => 
        t.id === editingTaskId 
          ? { ...t, [editingTaskField]: editValue }
          : t
      ));
    }
    setEditingTaskId(null);
    setEditingTaskField(null);
    setEditValue('');
  };

  const handleDeleteMilestone = (id) => {
    setMilestones(milestones.filter(m => m.id !== id));
    setTasks(tasks.filter(t => t.milestoneId !== id));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleToggleMilestoneComplete = (id) => {
    setMilestones(milestones.map(m =>
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  const handleToggleTaskComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const handleAddMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: '',
      completed: false,
      dueDate: '',
      expanded: true,
      priority: 'Medium',
      description: ''
    };
    setMilestones([...milestones, newMilestone]);
    handleMilestoneEdit(newMilestone.id, 'title', '');
  };

  const handleAddTask = (milestoneId) => {
    const newTask = {
      id: Date.now(),
      title: '',
      completed: false,
      milestoneId,
      dueDate: '',
      priority: 'Medium'
    };
    setTasks([...tasks, newTask]);
    handleTaskEdit(newTask.id, 'title', '');
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <GoalHeader />
      <GridContainer milestones={milestones} tasks={tasks} />
      
      <Box sx={{ mt: 4, mb: 2 }}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleAddMilestone}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            }
          }}
        >
          Add Milestone
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        {milestones.map((milestone) => (
          <Milestone
            key={milestone.id}
            milestone={milestone}
            tasks={tasks.filter(t => t.milestoneId === milestone.id)}
            onToggleComplete={handleToggleMilestoneComplete}
            onDelete={handleDeleteMilestone}
            onEdit={handleMilestoneEdit}
            onAddTask={handleAddTask}
            onTaskToggleComplete={handleToggleTaskComplete}
            onTaskDelete={handleDeleteTask}
            onTaskEdit={handleTaskEdit}
            isEditing={editingMilestoneId === milestone.id}
            editValue={editValue}
            onEditChange={setEditValue}
            onEditComplete={handleMilestoneEditComplete}
            editingTaskId={editingTaskId}
            taskEditValue={editValue}
            onTaskEditChange={setEditValue}
            onTaskEditComplete={handleTaskEditComplete}
          />
        ))}
      </DragDropContext>
    </Box>
  );
};

export default GoalHub;