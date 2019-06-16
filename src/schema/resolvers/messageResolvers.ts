import { PubSub, withFilter } from 'apollo-server';
import { getRepository } from 'typeorm';
import { contextType } from '..';
import { returnError } from '../../config/errorHandling';
import { UN_AUTHROIZED } from '../../config/errorMessages';
import Chat from '../../entity/Chat';
import Message from '../../entity/Message';
const FCM = require('fcm-node');

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

const serverKey = require('../../config/chap-app27-firebase-adminsdk-1i7ch-48b0700d0e.json');

const fcm = new FCM(serverKey);

async function createMessage(_, { chatId, text }, { user }: contextType) {
  if (!user) return returnError('createMessage', UN_AUTHROIZED);

  const chat = await Chat.findOne({ id: chatId });
  chat.lastMessage = text;

  const newMessage = await createNewMessage(text, user, chat);
  await chat.save();

  const chats = await getChatRepo(chatId);
  const membersToken = [];
  chats[0].members.forEach(({ fcmToken }) => {
    if (fcmToken) membersToken.push(fcmToken);
  });

  var message = {
    registration_ids: membersToken,
    notification: {
      title: user.name,
      body: text,
      sound: 'default',
    },
  };

  fcm.send(message, function(err, response) {
    if (err) {
      console.log('Something has gone wrong!', err);
    } else {
      console.log('Successfully sent with response: ', response);
    }
  });
  return triggerSubscription(user.id, chatId, newMessage);
}

async function createNewMessage(text, user, chat) {
  const message = await Message.create({ text, sender: user, chat });
  await message.save();
  return message;
}

async function triggerSubscription(senderId, chatId, message) {
  pubSub.publish(GET_CHAT_SUB, { getNewMessages: message, chatId });
  return null;
}

async function getMessages(_, { chatId }, { user }: contextType) {
  if (!user) return returnError('getMessage', UN_AUTHROIZED);

  let chats: Chat[] = await getChatRepo(chatId);

  if (!chats[0].members.some(({ id }) => id === user.id))
    return returnError('getMessage', UN_AUTHROIZED);

  const messages = chats[0].messages
    .map(message => {
      if (message.sender.id === user.id) return { ...message, me: true };
      return { ...message, me: false };
    })
    .reverse();

  return { chat: { ...chats[0], messages } };
}

export async function getChatRepo(chatId: string) {
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
