import { objectType } from '@nexus/schema';

const IS_NEXT = typeof process.env['NEXT_PUBLIC_SITE_URL'] !== 'undefined';
const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.avatarUrl();
  },
});
