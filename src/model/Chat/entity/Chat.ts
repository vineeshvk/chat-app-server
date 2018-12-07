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

	@ManyToMany(type => User, member => member.chats)
	@JoinTable()
	members: User[];

	@OneToMany(type => Message, messages => messages.chat)
	@JoinTable()
	messages: Message[];
}
