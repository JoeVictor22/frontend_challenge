import React, { Component } from 'react';
import { Icons } from '../../iconSet';
import { SideBar, SideBarItem, SideBarDropDown, SideBarDropDownItem, SideBarDropDownGroup } from '../template/Layout';

/*----------------------------------------------------------------------------------------------------*/

class Admin extends Component 
{
	render() 
	{
		return (
			<SideBar>
				<SideBarItem active={ false } url="/" name='menu.dashboard' icon={ Icons.dashboard } />			
				<SideBarItem active={ false } url="/user/list" name='menu.user.title' icon={ Icons.stagecenter } />

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
				<SideBarItem active={ false } url="/user/list" name='menu.user.title' icon={ Icons.stagecenter } />

			</SideBar>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

export { Admin, User };
