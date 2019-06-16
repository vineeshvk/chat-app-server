import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Chat from './Chat';
import Message from './Message';

@Entity('users')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: String;

  @Column({ unique: true })
  email: string;

  @Column('text')
  password: string;

  @ManyToMany(type => Chat, chat => chat.members,{onDelete: 'CASCADE'})
  chats: Chat[];

  @OneToMany(type => Message, messages => messages.sender,{onDelete: 'CASCADE'})
  messages: Message[];

  @Column({nullable:true})
  fcmToken: string;
}
