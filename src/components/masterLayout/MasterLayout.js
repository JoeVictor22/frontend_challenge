import React, { Component } from 'react';
import AuthService from '../../services/AuthService';
import { Properties } from '../../config';
import { sleep } from '../utils/Utils';
import { NavBar, Footer, ScrollToTop } from '../../components/template/Layout';
import { Admin, User } from '../menu/Menu';

const Auth = new AuthService();

class MasterLayout extends Component 
{
	constructor(props) 
	{
		super(props);
		
		document.getElementsByTagName('title')[0].innerHTML = Properties.appName;

		this.loadUserRole = this.loadUserRole.bind(this);
				
		this.state = {
			role: null
		};
	}

/*----------------------------------------------------------------------------------------------------*/

	componentWillMount() {
		this.loadUserRole();
	}

/*----------------------------------------------------------------------------------------------------*/
	
	loadUserRole()
	{
		let scope = this;
		sleep(100).then(function() 
		{
			const role = Auth.getUserRole();
			scope.setState({
				role: role
			});
		});
	}

/*----------------------------------------------------------------------------------------------------*/
	
	render() 
	{	
		const MenuRole = (props) => 
		{
			let menu;

			switch (props.role) 
			{
				case "1":
					menu = <Admin />;
					break;

				case "2":
					menu = <User />;
					break;

				default:
					menu = (<div></div>);
					break;
			}

			return menu;
		}

		const Nav = (props) => 
		{
			if (props.role != null) {
				return <NavBar />;
			} 
			else {
				return <div></div>;
			}
		}

		const Foot = (props) => 
		{
			if (props.role != null) {
				return <Footer />;
			} 
			else {
				return <div></div>;
			}
		}

		return (
			<React.Fragment>
				<div>{ this.state.breadcrumb }</div>
				<Nav role={ this.state.role } />
				<div id="wrapper">
					<MenuRole role={ this.state.role } />
					<div id="content-wrapper">
						<div className="container-fluid">
							<React.Fragment>{ this.props.children( { onLoadUserRole: this.loadUserRole, role: this.state.role } ) }</React.Fragment>
						</div>
					</div>
				</div>
				<Foot role={ this.state.role } />
				<ScrollToTop />
			</React.Fragment>
		
		);
	}

/*----------------------------------------------------------------------------------------------------*/

}

export default MasterLayout;