import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Message from './Message';
import User from './User';

@Entity()
export default class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => Message, messages => messages.chat, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  messages: Message[];

  @JoinTable()
  @ManyToMany(type => User, member => member.chats, { onDelete: 'CASCADE' })
  members: User[];

  @Column({ nullable: true })
  lastMessage: string;

  @Column({ nullable: true })
  name: string;
}
