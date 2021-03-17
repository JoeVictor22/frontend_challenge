const env = process.env.NODE_ENV || "development";
const back_uri = process.env.REACT_APP_BACK_URI || "http://localhost:5000";

const config = {
	'development': {
		'domain': 'http://localhost:5000',
		'appName': "Frontend",
		'version': "0.0.0.1",
		'company': "Algo Tecnologia",
		'year': "2020"
	},
	'production': {
		'domain': "http://localhost:5000",
		'appName': "Frontend",
		'version': "0.0.0.1",
		'company': "Algo Tecnologia",
		'year': "2020"
	}
};

console.log(`we are on [${env}] mode`);
console.log(`we are on [${back_uri}]`);

export const Properties = config[env];
