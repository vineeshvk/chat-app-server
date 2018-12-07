import { joinExecutableSchema } from '../config/joinExcutableSchema';
import Message from './entity/Message';
import { mutationResolvers } from './resolvers/mutationResolvers';
import { queryResolvers } from './resolvers/queryResolvers';
import { subscriptionResolvers } from './resolvers/subscriptionResolvers';

const messageSchema = joinExecutableSchema(
	{ ...queryResolvers, ...mutationResolvers, ...subscriptionResolvers },
	__dirname
);
export { messageSchema, Message };

