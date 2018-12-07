import { ApolloServer } from 'apollo-server';
import { createConnection } from 'typeorm';
import schema from './../model';

export async function startServer(port: number) {
	const server = new ApolloServer({ schema });
	await createConnection();
	server
		.listen(port)
		.then(({ url, subscriptionsUrl }) =>
			console.log(
				`connected at ${url}...\nsubscription url at ${subscriptionsUrl}`
			)
		);
}
