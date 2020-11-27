import { prop, manyToOne, oneToMany, Model, Collection } from '~/model';
import { Issue } from './issue';
import { User } from './user';

export class Project extends Model {
  @prop()
  name!: string;

  @manyToOne(() => User, 'projects')
  user!: User;

  @oneToMany(() => Issue, 'project')
  issues!: Collection<Issue>;
}
