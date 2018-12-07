import { joinExecutableSchema } from '../config/joinExcutableSchema';
import Chat from './entity/Chat';
import { mutationResolvers } from './resolvers/mutationResolvers';
import { queryResolvers } from './resolvers/queryResolvers';

const chatSchema = joinExecutableSchema(
	{ ...queryResolvers, ...mutationResolvers },
	__dirname
);
export { chatSchema, Chat };
