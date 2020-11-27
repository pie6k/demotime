import { makeSchema } from '@nexus/schema';
import { nexusPrisma } from 'nexus-plugin-prisma';
import path from 'path';
import * as issueTypes from './issue';
import * as projectTypes from './project';
import * as userTypes from './user';
import './types';

const IS_NEXT = typeof process.env['NEXT_PUBLIC_SITE_URL'] !== 'undefined';
const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const SHOULD_GENERATE = IS_DEV && !IS_NEXT;

export const schema = makeSchema({
  types: {
    ...projectTypes,
    ...userTypes,
    ...issueTypes,
  },
  outputs: {
    schema: path.resolve(__dirname, './schema.graphql'),
    typegen: path.resolve(__dirname, './types.ts'),
  },
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  shouldGenerateArtifacts: SHOULD_GENERATE,
  typegenAutoConfig: {
    sources: [{ source: './context.ts', alias: 'context' }],
    contextType: 'context.GqlContext',
  },
  nonNullDefaults: {
    input: true,
    output: true,
  },
});

if (SHOULD_GENERATE) {
  console.log('Graphql Schema Generated');
}
