import alertify from 'alertifyjs';

const AlertifySuccess = (messages) => 
{
	for (let i = 0; i < messages.length; i++) {
		alertify.success(messages[i].message);
	}
}

const AlertifyError = (messages) => 
{
	for (let i = 0; i < messages.length; i++) {
		alertify.error(messages[i].message);
	}
}


export { AlertifySuccess, AlertifyError };