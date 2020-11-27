import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { getToken } from 'next-auth/jwt';
import { User } from '@linear/db';

export interface GqlContextAuth {
  canEditIssue(issueId?: string | null): Promise<boolean>;
  canEditProject(projectId?: string | null): Promise<boolean>;
  assertCanEditIssue(issueId?: string | null): Promise<void>;
  assertCanEditProject(projectId?: string | null): Promise<void>;
  assertLoggedIn(): void;
}

export interface GqlContext {
  userId: string | null;
  auth: GqlContextAuth;
}

function createAuthContextForUserId(userId: string | null) {
  const contextAuth: GqlContextAuth = {
    assertLoggedIn() {
      if (!userId) throw new Error('Unauthorized');
    },
    async canEditIssue() {
      return true;
    },
    async canEditProject() {
      return true;
    },
    async assertCanEditIssue(issueId) {
      if (!(await contextAuth.canEditIssue(issueId))) {
        throw new Error('Unauthorized');
      }
    },
    async assertCanEditProject(projectId) {
      if (!(await contextAuth.canEditProject(projectId))) {
        throw new Error('Unauthorized');
      }
    },
  };

  return contextAuth;
}

interface TokenData {
  name: string;
  email: string;
  id: string;
  iat: number;
  exp: number;
}

async function getUserIdForRequest(req: NextApiRequest) {
  const token = (await getToken({
    req,
    secret: process.env.AUTH_JWT_TOKEN_SECRET!,
  })) as TokenData | null;

  if (!token) {
    return null;
  }

  if (token.exp <= Date.now() / 1000) {
    return null;
  }

  return token.id;
}

export async function createGqlContextForRequest(
  req: NextApiRequest,
): Promise<GqlContext> {
  const userId = await getUserIdForRequest(req);

  const contextAuth = createAuthContextForUserId(userId);

  return {
    userId,
    auth: contextAuth,
  };
}
