import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';

export function joinExecutableSchema(resolvers, dir) {
	const typeDefs = importSchema(`${dir}/schemas/schema.graphql`);

	const schema = makeExecutableSchema({ typeDefs, resolvers });
	return schema;
}
