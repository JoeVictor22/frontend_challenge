import React, { Component } from 'react';
import { Icons } from '../../iconSet';
import { SideBar, SideBarItem } from '../template/Layout';

/*----------------------------------------------------------------------------------------------------*/

class Admin extends Component 
{
	render() 
	{
		return (
			<SideBar>
				<SideBarItem active={ false } url="/" name='menu.dashboard' icon={ Icons.dashboard } />			
				<SideBarItem active={ false } url="/usuario/list" name='menu.user.title' icon={ Icons.users } />
				<SideBarItem active={ false } url="/perfil/list" name='menu.perfil.title' icon={ Icons.profiles } />

			</SideBar>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class User extends Component 
{
	render() 
	{
		return (
			<SideBar>
				<SideBarItem active={ false } url="/" name='menu.dashboard' icon={ Icons.dashboard } />
				<SideBarItem active={ false } url="/usuario/me" name='menu.user.login' icon={ Icons.user } />
				<SideBarItem active={ false } url="/perfil/me" name='menu.perfil.perfil' icon={ Icons.profile } />
profile			</SideBar>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

export { Admin, User };
