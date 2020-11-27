import { Model, reference } from '~/model';
import { Project } from './project';
import { User } from './user';

export class AppState extends Model {
  @reference(() => User)
  activeUser?: User;

  @reference(() => Project)
  activeProject?: Project;
}
