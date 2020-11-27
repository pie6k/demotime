import { prop, manyToOne, Model } from '~/model';
import { User } from './user';
import { Project } from './project';

export enum IssueStatus {
  backlog = 'backlog',
  unstarted = 'unstarted',
  started = 'started',
  completed = 'completed',
  canceled = 'canceled',
}

export const allowedIssueStatus = Object.values(IssueStatus);

export class Issue extends Model {
  @prop()
  title!: string;

  @prop()
  description!: string;

  @prop()
  status!: IssueStatus;

  @manyToOne(() => Project, 'issues')
  project!: Project;

  @manyToOne(() => User, 'assignedIssues')
  assignedUser?: User;
}

export function getIssueStatusColor(issueStatus: IssueStatus) {
  switch (issueStatus) {
    case IssueStatus.backlog:
      return '#fff8';
    case IssueStatus.unstarted:
      return '#fff8';
    case IssueStatus.started:
      return '#F2C94C';
    case IssueStatus.completed:
      return '#5E6AD2';
    case IssueStatus.canceled:
      return '#fff8';
  }

  return '#fff';
}

export function getIssueStatusName(issueStatus: IssueStatus) {
  switch (issueStatus) {
    case IssueStatus.backlog:
      return 'Backlog';
    case IssueStatus.unstarted:
      return 'Unstarted';
    case IssueStatus.started:
      return 'Started';
    case IssueStatus.completed:
      return 'Completed';
    case IssueStatus.canceled:
      return 'Canceled';
  }

  throw new Error('Unknown issue status');
}
