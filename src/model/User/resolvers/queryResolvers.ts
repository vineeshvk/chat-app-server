import { GQL } from '../schemas/schema';
import { ResolverMap } from '../../config/graphql-utils';

export const queryResolvers: ResolverMap = {
	Query: {
		hello: (_, name: GQL.IHelloOnQueryArguments) => 'hello'
	}
};
