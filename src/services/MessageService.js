import { Messages } from '../messages';

class MessageService {

/*----------------------------------------------------------------------------------------------------*/

	constructor() {
		this.messages = Messages;
	}

/*----------------------------------------------------------------------------------------------------*/

	getMessage(path) {
		let paths = path.split('.');
		let obj = this.messages;

		for (let i = 0; i < paths.length; i++) {
			obj = obj[paths[i]];
		}
		
		return obj;
	}

/*----------------------------------------------------------------------------------------------------*/

}

export default MessageService;