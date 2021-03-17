import decode from 'jwt-decode';
import { Properties } from '../config';

class AuthService 
{

/*----------------------------------------------------------------------------------------------------*/

	constructor(domain)
	{
		this.domain			= domain || Properties.domain;
		this.fetch			= this.fetch.bind(this);
		this.login			= this.login.bind(this);
		this.user  			= null;
	}

/*----------------------------------------------------------------------------------------------------*/

	login(username, password) 
	{
		return this.fetch(`${this.domain}/auth`,
			{
				method: 'POST',
				body: JSON.stringify({
					username: username, 
					password: password
				})
			}
		).then(res =>
		{
			if (!res.error) 
			{
				this.setToken(res.access_token);
				this.setRefreshToken(res.refresh_token);
				this.setUser({role: res.user_role});
				this.updateProfile(res.access_token);
			}
			
			return Promise.resolve(res);
		});
	}

/*----------------------------------------------------------------------------------------------------*/

	loggedIn() 
	{
		const token = this.getToken();
		
		if (!!!token) {
			return false;
		}

		if (this.isTokenExpired(token)) 
		{
			const rfToken = this.getRefreshToken();

			if(this.isTokenExpired(rfToken)) {
				return false;
			}

			this.refreshToken(rfToken);
		}
		
		return true;
	}

/*----------------------------------------------------------------------------------------------------*/

	refreshToken(refreshTokenId) 
	{
		return fetch(`${this.domain}/refresh`,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.getRefreshToken()
				},	
				method: 'POST'
			}
		).then(res => 
		{
			res.json().then(json => 
			{
				this.setToken(json.access_token);
				console.log("token refreshed");	
			})
		});
	}

/*----------------------------------------------------------------------------------------------------*/

	isTokenExpired(token) 
	{
		try
		{
			const decoded = decode(token);

			if (decoded.exp < Date.now() / 1000) {
				return true;
			} 
			
			return false;

		} catch(err) {
			return false;
		}
	}

/*----------------------------------------------------------------------------------------------------*/

	setToken(idToken) {
		localStorage.setItem('id_token', idToken);
	}

/*----------------------------------------------------------------------------------------------------*/

	getToken() {
		return localStorage.getItem('id_token');
	}

/*----------------------------------------------------------------------------------------------------*/

	setRefreshToken(idToken) {
		localStorage.setItem('id_refresh_token', idToken);
	}

/*----------------------------------------------------------------------------------------------------*/

	getRefreshToken() {
		return localStorage.getItem('id_refresh_token');
	}

/*----------------------------------------------------------------------------------------------------*/

	logout() {
		localStorage.removeItem('id_token');
		localStorage.removeItem('id_refresh_token');
		localStorage.removeItem('user_profile_role');
		localStorage.removeItem('user_profile_email');
		localStorage.removeItem('user_profile_username');

		window.location.replace("/");
	}

/*----------------------------------------------------------------------------------------------------*/
	
	updateProfile(token) {
		fetch(`${this.domain}/me`,
			{
				method: 'GET',
				headers: {Authorization: 'Bearer ' + token}
			}
		)
			.then(res => 
			{
				res.json().then(json => {
						localStorage.setItem('user_profile_role', json.role_id);
						localStorage.setItem('user_profile_email', json.email);
						localStorage.setItem('user_profile_username', json.username);
					}
				)
			}
		)	
	}

/*----------------------------------------------------------------------------------------------------*/
	
	setUser(data) {
		this.user = data;
	}

/*----------------------------------------------------------------------------------------------------*/
	
	getUser() {
		return this.user;
	}

/*----------------------------------------------------------------------------------------------------*/

	getUserRole() 
	{
		if (this.getUser() == null) {
			return localStorage.getItem('user_profile_role');
		} 
		else {
			return this.getUser().role;
		}
	}

/*----------------------------------------------------------------------------------------------------*/

	getAuthorizationHeader() {
		return 'Bearer ' + this.getToken();
	}

/*----------------------------------------------------------------------------------------------------*/

	fetch(url, options) 
	{	
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}

		if (this.loggedIn()) {
			headers['Authorization'] = this.getAuthorizationHeader();
		}

		return fetch(url, 
		{
			headers,
			...options
		})
			.then(this._checkStatus)
			.then(response => response.json())
	}

/*----------------------------------------------------------------------------------------------------*/

	_checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response;
		} 
		else 
		{
			var error = new Error(response.statusText);
			error.response = response;
			throw error;
		}
	}

/*----------------------------------------------------------------------------------------------------*/

}

export default AuthService;