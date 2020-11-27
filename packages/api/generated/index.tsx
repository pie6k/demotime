import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type CreateProjectInput = {
  name: Scalars['String'];
  urlKey: Scalars['String'];
};

export type UpdateProjectInput = {
  name?: Maybe<Scalars['String']>;
  urlKey?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  urlKey: Scalars['String'];
  issues: Array<Issue>;
};

export type CreateIssueInput = {
  urlKey: Scalars['String'];
  title: Scalars['String'];
  assignedUserId?: Maybe<Scalars['String']>;
  status: IssueStatus;
  description: Scalars['String'];
  projectId: Scalars['String'];
};

export type UpdateIssueInput = {
  urlKey?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  assignedUserId?: Maybe<Scalars['String']>;
  status?: Maybe<IssueStatus>;
  description?: Maybe<Scalars['String']>;
};

export type Issue = {
  __typename?: 'Issue';
  id: Scalars['ID'];
  urlKey: Scalars['String'];
  title: Scalars['String'];
  user: User;
  userId?: Maybe<Scalars['String']>;
  assignedUser?: Maybe<User>;
  assignedUserId?: Maybe<Scalars['String']>;
  status: IssueStatus;
  description: Scalars['String'];
  project: Project;
  projectId?: Maybe<Scalars['String']>;
};

export enum IssueStatus {
  Backlog = 'Backlog',
  Todo = 'Todo',
  InProgress = 'InProgress',
  InReview = 'InReview',
  Done = 'Done',
  Canceled = 'Canceled'
}

export type Query = {
  __typename?: 'Query';
  viewer: Viewer;
};

export type Viewer = {
  __typename?: 'Viewer';
  user: User;
  projects: Array<Project>;
  createdIssues: Array<Issue>;
  assignedIssues: Array<Issue>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  updateProject: Project;
  createIssue: Issue;
  updateIssue: Issue;
  deleteIssue: Issue;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID'];
  input: UpdateProjectInput;
};


export type MutationCreateIssueArgs = {
  input: CreateIssueInput;
};


export type MutationUpdateIssueArgs = {
  id: Scalars['ID'];
  input: CreateProjectInput;
};


export type MutationDeleteIssueArgs = {
  id: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  User: ResolverTypeWrapper<Partial<User>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  CreateProjectInput: ResolverTypeWrapper<Partial<CreateProjectInput>>;
  UpdateProjectInput: ResolverTypeWrapper<Partial<UpdateProjectInput>>;
  Project: ResolverTypeWrapper<Partial<Project>>;
  CreateIssueInput: ResolverTypeWrapper<Partial<CreateIssueInput>>;
  UpdateIssueInput: ResolverTypeWrapper<Partial<UpdateIssueInput>>;
  Issue: ResolverTypeWrapper<Partial<Issue>>;
  IssueStatus: ResolverTypeWrapper<Partial<IssueStatus>>;
  Query: ResolverTypeWrapper<{}>;
  Viewer: ResolverTypeWrapper<Partial<Viewer>>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  User: Partial<User>;
  ID: Partial<Scalars['ID']>;
  String: Partial<Scalars['String']>;
  CreateProjectInput: Partial<CreateProjectInput>;
  UpdateProjectInput: Partial<UpdateProjectInput>;
  Project: Partial<Project>;
  CreateIssueInput: Partial<CreateIssueInput>;
  UpdateIssueInput: Partial<UpdateIssueInput>;
  Issue: Partial<Issue>;
  Query: {};
  Viewer: Partial<Viewer>;
  Mutation: {};
  Boolean: Partial<Scalars['Boolean']>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  urlKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issues?: Resolver<Array<ResolversTypes['Issue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IssueResolvers<ContextType = any, ParentType extends ResolversParentTypes['Issue'] = ResolversParentTypes['Issue']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  urlKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assignedUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  assignedUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['IssueStatus'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  viewer?: Resolver<ResolversTypes['Viewer'], ParentType, ContextType>;
};

export type ViewerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Viewer'] = ResolversParentTypes['Viewer']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  createdIssues?: Resolver<Array<ResolversTypes['Issue']>, ParentType, ContextType>;
  assignedIssues?: Resolver<Array<ResolversTypes['Issue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>;
  updateProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'id' | 'input'>>;
  createIssue?: Resolver<ResolversTypes['Issue'], ParentType, ContextType, RequireFields<MutationCreateIssueArgs, 'input'>>;
  updateIssue?: Resolver<ResolversTypes['Issue'], ParentType, ContextType, RequireFields<MutationUpdateIssueArgs, 'id' | 'input'>>;
  deleteIssue?: Resolver<ResolversTypes['Issue'], ParentType, ContextType, RequireFields<MutationDeleteIssueArgs, 'id'>>;
};

export type Resolvers<ContextType = any> = {
  User?: UserResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Issue?: IssueResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Viewer?: ViewerResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
