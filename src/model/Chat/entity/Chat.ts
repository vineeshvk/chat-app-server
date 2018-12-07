import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	OneToMany,
	JoinTable,
	BaseEntity
} from 'typeorm';
import { User } from '../../User';
import { Message } from '../../Message';

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
