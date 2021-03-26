const env = process.env.NODE_ENV || "development";
const back_uri = process.env.REACT_APP_BACK_URI || "http://localhost:5000";
const app_name = process.env.APP_NAME || "Web Admin";

const config = {
	'development': {
		'domain': back_uri,
		'appName': app_name,
		'version': "0.0.0.1",
		'company': "github.com/joevictor22",
		'year': "2021"
	}
};


export const Properties = config[env];
