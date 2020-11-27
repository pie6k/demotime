import { Session, User } from '@prisma/client';
import { db } from './client';

interface Profile {
  name: string;
  email: string;
  image: string;
}

function debug(...args: any[]) {
  if (process.env.NODE_ENV === 'development') console.info(...args);
}

export const createPrismaAuthAdapter = () => {
  async function getAdapter(appOptions: any) {
    // Called when a user signs in
    async function createUser(profile: Profile) {
      debug('Create user account', profile);
      return db.user.create({
        data: {
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.image,
        },
      });
    }

    async function updateUser(user: User) {
      debug('Update user account', user);
      await db.user.update({
        where: { id: user.id },
        data: {
          ...user,
        },
      });

      return true;
    }

    async function getUser(id = '') {
      debug('Get user account by ID', id);
      return db.user.findOne({ where: { id } });
    }

    async function getUserById(id = '') {
      debug('Get user account by ID', id);
      return db.user.findOne({ where: { id } });
    }

    async function getUserByProviderAccountId(
      providerId: string,
      providerAccountId: string,
    ) {
      debug(
        'Get user account by provider account ID',
        providerId,
        providerAccountId,
      );
      const account = await db.account
        .findOne({
          where: { providerAccountId },
        })
        .user();

      return account;
    }

    async function getUserByEmail(email: string) {
      debug('Get user account by email address', email);
      const user = await db.user.findOne({ where: { email } });

      return user ?? false;
    }

    async function getUserByCredentials(credentials: string) {
      debug('Get user account by credentials', credentials);
      return new Promise((resolve, reject) => {
        // @TODO Get user from DB
        resolve(true);
      });
    }

    async function deleteUser(userId: string) {
      debug('Delete user account', userId);
      await db.user.delete({ where: { id: userId } });
      return true;
    }

    async function linkAccount(
      userId: string,
      providerId: string,
      providerType: string,
      providerAccountId: string,
      refreshToken: string,
      accessToken: string,
      accessTokenExpires: string,
    ) {
      debug(
        'Link provider account',
        userId,
        providerId,
        providerType,
        providerAccountId,
        refreshToken,
        accessToken,
        accessTokenExpires,
      );

      return db.account.create({
        data: {
          accessToken,
          refreshToken,
          providerAccountId,
          providerId,
          providerType,
          user: {
            connect: {
              id: userId,
            },
          },
          accessTokenExpires,
        },
      });
    }

    async function unlinkAccount(
      userId: string,
      providerId: string,
      providerAccountId: string,
    ) {
      debug('Unlink provider account', userId, providerId, providerAccountId);

      await db.user.update({
        where: { id: userId },
        data: {
          accounts: {
            delete: {
              providerAccountId,
            },
          },
        },
      });

      return true;
    }

    async function createSession(user: User) {
      debug('Create session for user', user);
      const date = new Date();
      const sessionExpiryInDays = 30;
      const accessTokenExpiryInDays = 30;

      return db.session.create({
        data: {
          accessTokenExpires: new Date(
            date.setDate(date.getDate() + accessTokenExpiryInDays),
          ).toISOString(),
          expires: new Date(
            date.setDate(date.getDate() + sessionExpiryInDays),
          ).toISOString(),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    async function getSession(sessionToken: string) {
      debug('getSession', sessionToken);
      const session = await db.session.findOne({
        where: { accessToken: sessionToken },
      });
      return session;
    }

    async function updateSession(session: Session) {
      debug('updateSession', session);
      await db.session.update({ where: { id: session.id }, data: session });

      // const session = await db.session.findOne({ where: { accessToken: sessionToken } });
      return true;
    }

    async function deleteSession(sessionToken: string) {
      debug('deleteSession', sessionToken);
      await db.session.delete({ where: { accessToken: sessionToken } });
      return true;
    }

    async function getSessionById(id: string) {
      debug('getSessionById', id);
      return db.session.findOne({ where: { id } });
    }

    async function deleteSessionById(id: string) {
      debug('Delete session by ID', id);
      return db.session.delete({ where: { id } });
    }

    return {
      getUser,
      createUser,
      updateUser,
      getUserById,
      getUserByProviderAccountId,
      getUserByEmail,
      getUserByCredentials,
      deleteUser,
      linkAccount,
      unlinkAccount,
      createSession,
      getSessionById,
      updateSession,
      deleteSessionById,
      deleteSession,
      getSession,
    };
  }

  return { getAdapter };
};
