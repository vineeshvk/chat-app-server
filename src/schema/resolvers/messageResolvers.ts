import { PubSub, withFilter } from 'apollo-server';
import { getRepository } from 'typeorm';
import Chat from '../../entity/Chat'
import User from '../../entity/User'
import Message from '../../entity/Message'


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

async function createMessage(_, { chatId, senderId, text }) {
  const sender = await User.findOne({ id: senderId });
  const chat = await Chat.findOne({ id: chatId });
  const newMessage = await createNewMessage(text, sender, chat);

  return triggerSubscription(senderId, chatId, newMessage);
}

async function createNewMessage(text, sender, chat) {
  const message = await Message.create({ text, sender, chat });
  await message.save();
  return message;
}

export async function getAllMessages(chatId: string) {
  const chats = await getChatRepo();

  const chatMessages = chats.find(({ id }) => id === chatId);
  return chatMessages;
}

async function getChatRepo() {
  const chatRepo = getRepository(Chat);
  return await chatRepo.find({
    relations: ['members', 'messages', 'messages.sender'],
  });
}

async function triggerSubscription(senderId, chatId, message) {
  // const chats = await getAllMessages(chatId);
  pubSub.publish(GET_CHAT_SUB, { getNewMessages: message, chatId });
  return null;
}

async function getMessages(_, { chatId }) {
  const messages = await getAllMessages(chatId);
  return messages;
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