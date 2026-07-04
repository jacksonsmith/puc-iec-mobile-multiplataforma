import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { buildContext, type Context } from './context.js';
import { migrate } from './db.js';

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  migrate();

  const server = new ApolloServer<Context>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => buildContext(req.headers.authorization),
  });

  console.log(`CineHub GraphQL pronto em ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
