import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';

import { userSchema } from './User';
import { messageSchema } from './Message';
import { chatSchema } from './Chat';

const schemas: GraphQLSchema[] = [userSchema, messageSchema, chatSchema];

export default mergeSchemas({ schemas });
