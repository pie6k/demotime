import { Collection, Model, oneToMany, prop } from '~/model';
import { Issue } from './issue';
import { Project } from './project';

export class User extends Model {
  @prop()
  email!: string;

  @prop()
  avatarUrl?: string;

  @prop()
  username!: string;

  @oneToMany(() => Issue, 'assignedUser')
  assignedIssues!: Collection<Issue>;

  @oneToMany(() => Project, 'user')
  projects!: Collection<Project>;
}
