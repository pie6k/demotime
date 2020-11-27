import { db } from '@linear/db';
import {
  inputObjectType,
  mutationField,
  objectType,
  queryField,
} from '@nexus/schema';

export const Issue = objectType({
  name: 'Issue',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.status();
    t.model.description();
    t.model.projectId();
    t.model.userId();
    t.model.user();
    t.model.assignedUser();
    t.model.assignedUserId();
    t.model.urlKey();
    t.model.updatedAt();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.project();
  },
});

export const IssueCreateInput = inputObjectType({
  name: 'IssueCreateInput',
  definition(t) {
    t.string('id', { nullable: true });
    t.string('title', { nullable: false });
    t.field('status', { type: 'IssueStatus', nullable: false });
    t.string('description', { nullable: false });
    t.string('projectId', { nullable: false });
    t.string('assignedUserId', { nullable: true });
    t.string('urlKey', { nullable: false });
  },
});

export const IssueUpdateInput = inputObjectType({
  name: 'IssueUpdateInput',
  definition(t) {
    t.string('title', { nullable: false });
    t.field('status', { type: 'IssueStatus', nullable: false });
    t.string('description', { nullable: false });
    t.string('assignedUserId', { nullable: true });
    t.string('urlKey', { nullable: false });
  },
});

export const createIssue = mutationField('createIssue', {
  type: Issue,
  args: {
    input: IssueCreateInput,
  },
  async resolve(a, { input }, ctx) {
    ctx.auth.assertLoggedIn();
    await ctx.auth.assertCanEditProject(input.projectId);

    const newProject = await db.issue.create({
      data: {
        id: input.id ?? undefined,
        title: input.title,
        status: input.status,
        project: { connect: { id: input.projectId } },
        user: { connect: { id: ctx.userId! } },
        description: input.description,
        urlKey: input.urlKey,
      },
    });

    return newProject;
  },
});

export const updateIssue = mutationField('updateIssue', {
  type: Issue,
  args: {
    id: 'String',
    input: IssueUpdateInput,
  },
  async resolve(a, { id, input }, ctx) {
    await ctx.auth.assertLoggedIn();
    await ctx.auth.assertCanEditIssue(id);

    const updatedIssue = await db.issue.update({
      where: { id },
      data: {
        title: input.title,
        status: input.status,
        user: { connect: { id: ctx.userId! } },
        description: input.description,
        urlKey: input.urlKey,
      },
    });

    return updatedIssue;
  },
});

export const deleteIssue = mutationField('deleteIssue', {
  type: Issue,
  args: {
    id: 'String',
  },
  async resolve(a, { id }, ctx) {
    await ctx.auth.assertLoggedIn();
    await ctx.auth.assertCanEditIssue(id);

    const deletedIssue = await db.issue.delete({ where: { id } });

    return deletedIssue;
  },
});

export const avaliableIssues = queryField('avaliableIssues', {
  type: Issue,
  list: true,
  async resolve(root, args, ctx) {
    ctx.auth.assertLoggedIn();

    const issues = await db.issue.findMany({
      where: {
        OR: [
          { userId: ctx.userId },
          // TODO: What if user is assigned, but has no access to the project anymore?
          { assignedUserId: ctx.userId },
        ],
      },
    });

    return issues;
  },
});
