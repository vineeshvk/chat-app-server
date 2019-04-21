import { ApolloServer } from 'apollo-server';
import { createConnection } from 'typeorm';
import { dbconfig } from '../config/ormconfig';
import schema from './../schema';

export async function startServer(port: number) {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUser(token);
      console.log("token",token);
      
      return { user };
    },
  });
  await connectDB();

  server
    .listen(port)
    .then(({ url, subscriptionsUrl }) =>
      console.log(
        `connected at ${url}...\nsubscription url at ${subscriptionsUrl}`
      )
    );
}

const getUser = (token:string)=>{

}

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
