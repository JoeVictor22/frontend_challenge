import React from "react";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import AuthService from './services/AuthService';
import MasterLayout from './components/masterLayout/MasterLayout'

import Home from './pages/home/Home';
import About from './pages/about/About';
import {UsersList, UsersAdd, UsersEdit, UsersView} from './pages/users/Users';
import {CidadeList, CidadeAdd, CidadeEdit, CidadeView} from './pages/cidade/Cidade';
import {UfList, UfAdd, UfEdit, UfView} from './pages/uf/Uf';

import Login from './pages/login/Login';

const Auth = new AuthService();

/*----------------------------------------------------------------------------------------------------*/

function PrivateRoute({ component: Component, ...rest }) 
{
	return (
		<Route {...rest} render=
			{	
				props =>
					Auth.loggedIn() ? 
					( <Component {...props} /> ) : 
					( <Redirect to={{ pathname: "/login", state: { from: props.location } }} /> )
			}
		/>
	);
}

/*----------------------------------------------------------------------------------------------------*/

function Routes() 
{
	return (
		<Router>
			<MasterLayout>
				{
					props =>
						<Switch>
							<PrivateRoute exact path="/" component={ (privateRouteProps) => (<Home {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/about" component={ (privateRouteProps) => (<About {...privateRouteProps} {...props} />) } />

							<PrivateRoute path="/user/list" component={ (privateRouteProps) => (<UsersList {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/user/add" component={ (privateRouteProps) => (<UsersAdd {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/user/edit" component={ (privateRouteProps) => (<UsersEdit {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/user/view" component={ (privateRouteProps) => (<UsersView {...privateRouteProps} {...props} />) } />

							<PrivateRoute path="/cidade/list" component={ (privateRouteProps) => (<CidadeList {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/cidade/add" component={ (privateRouteProps) => (<CidadeAdd {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/cidade/edit" component={ (privateRouteProps) => (<CidadeEdit {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/cidade/view" component={ (privateRouteProps) => (<CidadeView {...privateRouteProps} {...props} />) } />

							<PrivateRoute path="/uf/list" component={ (privateRouteProps) => (<UfList {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/uf/add" component={ (privateRouteProps) => (<UfAdd {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/uf/edit" component={ (privateRouteProps) => (<UfEdit {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/uf/view" component={ (privateRouteProps) => (<UfView {...privateRouteProps} {...props} />) } />

							<Route path="/login" component={ Login } />
						</Switch>
				}
				
			</MasterLayout>
		</Router>
	);
}

/*----------------------------------------------------------------------------------------------------*/

export default Routes;