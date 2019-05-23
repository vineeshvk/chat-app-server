import { PubSub, withFilter } from 'apollo-server';
import { getRepository } from 'typeorm';
import { contextType } from '..';
import { returnError } from '../../config/errorHandling';
import { UN_AUTHROIZED } from '../../config/errorMessages';
import Chat from '../../entity/Chat';
import Message from '../../entity/Message';

const resolvers = {
  Mutation: {
    createMessage,
  },
  Query: {
    getMessages,
  },
  Subscription: {
    getNewMessages: {
      subscribe: getNewMessages(),
    },
  },
};

async function createMessage(_, { chatId, text }, { user }: contextType) {
  if (!user) return returnError('createMessage', UN_AUTHROIZED);

  const chat = await Chat.findOne({ id: chatId });
  chat.lastMessage = text;

  const newMessage = await createNewMessage(text, user, chat);
  await chat.save();
  return triggerSubscription(user.id, chatId, newMessage);
}

async function createNewMessage(text, user, chat) {
  const message = await Message.create({ text, sender: user, chat });
  await message.save();
  return message;
}

async function triggerSubscription(senderId, chatId, message) {
  // const chats = await getAllMessages(chatId);
  pubSub.publish(GET_CHAT_SUB, { getNewMessages: message, chatId });
  return null;
}

async function getMessages(_, { chatId }, { user }: contextType) {
  if (!user) return returnError('getMessage', UN_AUTHROIZED);

  let chat: Chat[] = await getChatRepo(chatId);

  // if (!chat[0].members.includes(user))
  //   return returnError('getMessage', UN_AUTHROIZED);

  const messages = chat[0].messages
    .map(message => {
      if (message.sender.id === user.id) return { ...message, me: true };
      return { ...message, me: false };
    })
    .reverse();

  return { ...chat[0], messages };
}

async function getChatRepo(chatId: string) {
  const chatRepo = getRepository(Chat);
  return await chatRepo.find({
    relations: ['members', 'messages', 'messages.sender'],
    where: { id: chatId },
  });
}

function getNewMessages() {
  return withFilter(
    () => pubSub.asyncIterator(GET_CHAT_SUB),
    (payload, variable) => payload.chatId === variable.chatId
  );
}

export const GET_CHAT_SUB = 'GET_CHAT_SUB';
export const pubSub = new PubSub();

export default resolvers;
