import axios from 'axios';
import { Properties } from '../config';
import AuthService from './AuthService';

class RestService {

	/*----------------------------------------------------------------------------------------------------*/

	constructor() {
		this.Auth = new AuthService();
	}

	/*----------------------------------------------------------------------------------------------------*/

	get(urlBase, parameters) {
		if (!this.Auth.loggedIn()) {
			this.props.history.replace('/');
		}

		const url = `${Properties.domain}/${urlBase}`;
		const token = this.Auth.getAuthorizationHeader();

		return axios({
			method: 'GET',
			params: parameters,
			url: url,
			headers: {
				Authorization: token
			}
		});
	}

	/*----------------------------------------------------------------------------------------------------*/

	post(urlBase, parameters) {
		if (!this.Auth.loggedIn()) {
			this.props.history.replace('/');
		}

		const url = `${Properties.domain}/${urlBase}`;
		const token = this.Auth.getAuthorizationHeader();

		return axios({
			method: 'POST',
			data: parameters,
			url: url,
			headers: {
				Authorization: token
			}
		});
	}

	/*----------------------------------------------------------------------------------------------------*/

	delete(urlBase, parameters) {
		if (!this.Auth.loggedIn()) {
			this.props.history.replace('/');
		}

		const url = `${Properties.domain}/${urlBase}`;
		const token = this.Auth.getAuthorizationHeader();

		return axios({
			method: 'DELETE',
			data: parameters,
			url: url,
			headers: {
				Authorization: token
			}
		});
	}

	/* ----------------------------------------------------------------------------------------------------*/

	edit(urlBase, parameters) {
		if (!this.Auth.loggedIn()) {
			this.props.history.replace('/');
		}

		const url = `${Properties.domain}/${urlBase}`;
		const token = this.Auth.getAuthorizationHeader();

		return axios({
			method: 'PUT',
			data: parameters,
			url: url,
			headers: {
				Authorization: token
			}
		});
	}

	/* ----------------------------------------------------------------------------------------------------*/

	view(urlBase, parameters) {
		if (!this.Auth.loggedIn()) {
			this.props.history.replace('/');
		}

		const url = `${Properties.domain}/${urlBase}`;
		const token = this.Auth.getAuthorizationHeader();

		return axios({
			method: 'GET',
			data: parameters,
			url: url,
			headers: {
				Authorization: token
			}
		});
	}

}

export default RestService;