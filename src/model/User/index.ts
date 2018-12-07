import { joinExecutableSchema } from '../config/joinExcutableSchema';
import User from './entity/User';
import { mutationResolvers } from './resolvers/mutationResolvers';
import { queryResolvers } from './resolvers/queryResolvers';

const userSchema = joinExecutableSchema(
	{ ...queryResolvers, ...mutationResolvers },
	__dirname
);
export { userSchema, User };
