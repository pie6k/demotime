import { db } from '@linear/db';
import {
  inputObjectType,
  mutationField,
  objectType,
  queryField,
} from '@nexus/schema';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    t.model.id();
    t.model.urlKey();
    t.model.updatedAt();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.name();
  },
});

export const ProjectCreateInput = inputObjectType({
  name: 'ProjectCreateInput',
  definition(t) {
    t.string('urlKey', { required: true });
    t.string('name', { required: true });
  },
});

export const createProject = mutationField('createProject', {
  type: Project,
  args: {
    input: ProjectCreateInput,
  },
  async resolve(a, { input }, ctx) {
    ctx.auth.assertLoggedIn();
    const newProject = await db.project.create({
      data: {
        name: input.name,
        urlKey: input.urlKey,
        owner: { connect: { id: ctx.userId! } },
      },
    });

    return newProject;
  },
});

export const ProjectUpdateInput = inputObjectType({
  name: 'ProjectUpdateInput',
  definition(t) {
    t.string('urlKey', { required: true });
    t.string('name', { required: true });
  },
});

export const updateProject = mutationField('updateProject', {
  type: Project,
  args: {
    id: 'String',
    input: ProjectUpdateInput,
  },
  async resolve(a, { id, input }, ctx) {
    ctx.auth.assertLoggedIn();
    await ctx.auth.assertCanEditProject(id);

    const updatedProject = await db.project.update({
      where: {
        id,
      },
      data: {
        name: input.name,
        urlKey: input.urlKey,
      },
    });

    return updatedProject;
  },
});

export const avaliableProjects = queryField('avaliableProjects', {
  type: Project,
  list: true,
  async resolve(root, args, ctx) {
    ctx.auth.assertLoggedIn();

    const projects = await db.project.findMany({
      where: { ownerId: ctx.userId! },
    });

    return projects;
  },
});

export const projectByKey = queryField('projectByKey', {
  type: Project,
  args: {
    urlKey: 'String',
  },
  async resolve(root, args, ctx) {
    ctx.auth.assertLoggedIn();

    const project = await db.project.findOne({
      where: { urlKey: args.urlKey },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    await ctx.auth.assertCanEditProject(project.id);

    return project;
  },
});

export const isProjectUrlKeyFree = queryField('isProjectUrlKeyFree', {
  type: 'Boolean',
  args: {
    urlKey: 'String',
  },
  async resolve(root, args, ctx) {
    ctx.auth.assertLoggedIn();

    const existingProject = await db.project.findOne({
      where: { urlKey: args.urlKey },
    });

    if (existingProject) {
      return false;
    }

    return true;
  },
});
