import { startServer } from './tools/startServer';

startServer(4000).then(() => {
	console.log('running in 4000');
});
