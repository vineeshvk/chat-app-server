import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	OneToMany,
	JoinTable,
	BaseEntity
} from 'typeorm';
import Message from './Message';
import User from './User';


@Entity()
export default class Chat extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToMany(type => Message, messages => messages.chat)
	@JoinTable()
	messages: Message[];

	@JoinTable()
	@ManyToMany(type => User, member => member.chats)
	members: User[];
}
