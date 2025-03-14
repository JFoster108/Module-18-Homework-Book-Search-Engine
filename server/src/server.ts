import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  await server.start();

  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    console.log(__dirname)
    app.use(express.static(path.join(__dirname, '../../client/dist')));
  }

  app.use('/graphql', expressMiddleware(server, { context: async ({ req }) => await authMiddleware({ req }) }));

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`));
  });
}

startApolloServer();
