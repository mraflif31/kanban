export const initialData = {
  columns: {
    'column-1': { id: 'column-1', title: 'Backlog', taskIds: ['task-1', 'task-2','task-3'] },
    'column-2': { id: 'column-2', title: 'To Do', taskIds: [] },
    'column-3': { id: 'column-3', title: 'Done', taskIds: [] },
  },
  tasks: {
    'task-1': {
      issue_id: 'task-1',
      title: 'Improve accuracy of voice-to-text model',
      assignee: 'C',
      start_date: '2020-03-10',
      end_date: '2020-03-18',
      tags: 'Research',
    },
    'task-2': {
      issue_id: 'task-2',
      title: 'Create API to load user info from database',
      assignee: 'C',
      start_date: '2020-03-10',
      end_date: '2020-03-22',
      tags: 'Backend',
    },
    'task-3': {
      issue_id: 'task-3',
      title: 'Two-factor authentication to make private',
      assignee: 'C',
      start_date: '2020-03-10',
      end_date: '2020-03-23',
      tags: 'Design',
    },
  },
  columnIds: ['column-1','column-2','column-3'],
  tagsColor: {
    'Research' : {id: 'Research', backgroundColor: "#FFF3D2", color: "#F1C330" },
    'Backend' : {id: 'Backend', backgroundColor: "#FFE5F0", color: "#F46FB5" },
    'Design' : {id: 'Design', backgroundColor: "#E3EFFF", color: "#3F8CD9" },
  },
}