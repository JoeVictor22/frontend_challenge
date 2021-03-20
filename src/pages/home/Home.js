import React from 'react';
import AuthService from '../../services/AuthService';
import BasePage from '../basePage/BasePage';

const auth = new AuthService()

class Home extends BasePage {

	componentDidMount(){
		let user = auth.getUser();
		this.setState({...user});
	}
	render() 
	{
		return (
			<React.Fragment>
				<div className="card text-white bg-dark">
					<h2 className="card-header text-center text-uppercase">Web App</h2>
					<div className="card-body p-4">
						<h3 className="card-title">Olá {this.state.name}, seja bem-vindo</h3>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Home;
