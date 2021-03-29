const env = process.env.NODE_ENV || "development";
const back_uri = process.env.REACT_APP_BACK_URI || "http://localhost:5000";
const app_name = process.env.APP_NAME || "Web Admin";
const version = process.env.FRONT_VERSION || "0";
const year = process.env.YEAR || "";
const company = process.env.COMPANY || "github.com/joevictor22";


const config = {
	'development': {
		'domain': back_uri,
		'appName': app_name,
		'version': version,
		'company': company,
		'year': year
	}
};


export const Properties = config[env];
