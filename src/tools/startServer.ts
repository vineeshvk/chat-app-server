import { ApolloServer } from 'apollo-server';
import { decode } from 'jsonwebtoken';
import { createConnection } from 'typeorm';
import { dbconfig } from '../config/ormconfig';
import User from '../entity/User';
import schema from './../schema';

export async function startServer(port: number) {
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await getUser(token);
      return { user };
    },
  });
  await connectDB();

  server
    .listen(process.env.PORT || port)
    .then(({ url, subscriptionsUrl }) => console.log(`server is connected`));
}

const getUser = async (token: string) => {
  const [Bearer, jwt] = token.split(' ');
  const userId = decode(jwt);
  if (!Bearer || !userId) return null;
  //@ts-ignore
  const user = await User.findOne({ id: userId.id });
  return user;
};

const connectDB = async () => {
  let retry = 10;
  while (retry !== 0) {
    try {
      await createConnection(dbconfig);
      console.log('🗄️ database connected 🗄️');
      break;
    } catch (e) {
      retry--;
      console.log(e);
      console.log(`${retry} retries remaining`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};
