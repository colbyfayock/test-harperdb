import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter";

async function harperClient(body) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${process.env.HARPER_API_KEY}`,
    },
    body: JSON.stringify(body),
    redirect: 'follow',
  }

  const response = await fetch('https://test1-colbyfayock.harperdbcloud.com', requestOptions);
  const result = await response.text();

  return JSON.parse(result, (key, value) => {
    if ( !isNaN(Date.parse(value)) ) {
      return new Date(value);
    }
    return value;
  });
}

async function getUserByEmail(email) {
  const user = await harperClient({
    operation: 'sql',
    sql: `SELECT * FROM Users.Profiles WHERE email = "${email}"`
  });
  return user && user[0];
}

async function getUserById(id) {
  const user = await harperClient({
    operation: 'sql',
    sql: `SELECT * FROM Users.Profiles WHERE id = "${id}"`
  });
  return user && user[0];
}

async function getUserByProvider({ provider, providerAccountId }) {
  const account = await harperClient({
    operation: 'sql',
    sql: `SELECT * FROM Users.Accounts WHERE provider = "${provider}" AND providerAccountId = "${providerAccountId}"`
  });
  const user = await getUserById(account[0]?.userId);
  return user;
}

async function getSessionByToken(token) {
  const session = await harperClient({
    operation: 'sql',
    sql: `SELECT * FROM Users.Sessions WHERE sessionToken = "${token}"`
  });
  return session && session[0];
}

async function getAccountById(id) {
  const account = await harperClient({
    operation: 'sql',
    sql: `SELECT * FROM Users.Accounts WHERE id = "${id}"`
  });
  return account && account[0];
}

async function getAccountByUserId(userId) {
  const account = await harperClient({
    operation: 'sql',
    sql: `SELECT * FROM Users.Accounts WHERE userId = "${userId}"`
  });
  return account && account[0];
}


export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET
    }),
  ],
  adapter: (function MyAdapter(client, options = {}) {
    return {
      async createUser(user) {
        console.log('<<< createUser');
        const existing = await getUserByEmail(user.email);

        if ( existing ) return existing;

        const result = await harperClient({
          operation: 'insert',
          schema: 'Users',
          table: 'Profiles',
          records: [user]
        });

        return {
          ...user,
          id: result.inserted_hashes[0]
        };
      },
      async getUser(id) {
        console.log('<<< getUser');
        return await getUserById(id);
      },
      async getUserByEmail(email) {
        console.log('<<< getUserByEmail');
        return await getUserByEmail(email);
      },
      async getUserByAccount({ providerAccountId, provider }) {
        console.log('<<< getUserByAccount');
        return await getUserByProvider({ providerAccountId, provider });
      },
      async updateUser(user) {
        console.log('<<< updateUser')
        const profile = await getUserById(user.id);
        const result = await harperClient({
          operation: 'update',
          schema: 'Users',
          table: 'Profiles',
          hash_values: [session]
        });
        return user;
      },
      async linkAccount(account) {
        console.log('<<< linkAccount');
        await harperClient({
          operation: 'insert',
          schema: 'Users',
          table: 'Accounts',
          records: [account]
        });
        return account;
      },
      async createSession(session) {
        console.log('<<< createSession')
        await harperClient({
          operation: 'insert',
          schema: 'Users',
          table: 'Sessions',
          records: [session]
        });
        return session;
      },
      async getSessionAndUser(sessionToken) {
        console.log('<<< getSessionAndUser')
        const session = await getSessionByToken(sessionToken);
        const user = await getUserById(session?.userId);

        if ( !session || !user ) return;

        return { session, user };
      },
      async updateSession(session) {
        console.log('<<< updateSession')
        const existing = await getSessionByToken(session.sessionToken);
        const result = await harperClient({
          operation: 'update',
          schema: 'Users',
          table: 'Sessions',
          hash_values: [{
            id: existing.id,
            ...session
          }]
        });
        return session;
      },
      async deleteSession(sessionToken) {
        console.log('<<< deleteSession')
        const existing = await getSessionByToken(sessionToken);
        await harperClient({
          operation: 'delete',
          schema: 'Users',
          table: 'Sessions',
          hash_values: [existing.id]
        });
        return sessionToken;
      },
    }
  })(),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log('<<< signIn')
      // console.log('user', user);
      // console.log('account', account);
      // console.log('profile', profile);
      // console.log('email', email);
      // console.log('credentials', credentials);
      // console.log('>>> signIn')
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, token, user }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log('token', token);
      // console.log('user', user);
      // console.log('account', account);
      // console.log('profile', profile);
      // console.log('isNewUser ', isNewUser );
      // console.log('<<< jwt')
      // console.log('>>> jwt')
      return token
    }
  }
})