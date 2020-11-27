import { createRoute } from './route';

export const routes = {
  home: createRoute('/'),
  project: {
    new: createRoute('/new-project'),
    home: createRoute<{ projectId: string }>('/[projectId]'),
    assigned: createRoute<{ projectId: string }>('/[projectId]/assigned'),
    backlog: createRoute<{ projectId: string }>('/[projectId]/backlog'),
    inbox: createRoute<{ projectId: string }>('/[projectId]/inbox'),
    issueDetails: createRoute<{ projectId: string; issueId: string }>(
      '/[projectId]/issue/[issueId]',
    ),
    addIssue: createRoute<{ projectId: string }>('/[projectId]/issue/new'),
  },
};
