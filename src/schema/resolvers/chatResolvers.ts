import { getRepository } from 'typeorm';
import Chat from '../../entity/Chat';
import User from '../../entity/User';

const resolvers = {
  Mutation: {
    createChat,
  },
  Query: {
    getChats,
  },
};

async function createChat(_, { membersId }) {
  const members = await getUserObject(membersId);

  return await createNewChat(members);
}

async function createNewChat(members) {
  const chat = await Chat.create({});
  await chat.save();
  chat.members = members;
  await chat.save();

  return null;
}

//get the user object from the user ids and then create a chat
async function getUserObject(membersId: string[]) {
  const members = await Promise.all(
    membersId.map(async memberId => {
      const user = await User.findOne({ id: memberId });
      return user;
    })
  );
  return members;
}

async function getChats(_, { userId }, { user }) {
  const userR = await getUserRepo();
  const userChats = userR.find(({ id }) => id === userId);
  return userChats.chats;
}

async function getUserRepo() {
  const userRepo = getRepository(User);

  const user = await userRepo.find({
    relations: ['chats', 'chats.members'],
  });

  return user;
}

export default resolvers;
