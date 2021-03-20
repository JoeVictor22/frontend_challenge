import React from "react";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import AuthService from './services/AuthService';
import MasterLayout from './components/masterLayout/MasterLayout'

import Home from './pages/home/Home';
import About from './pages/about/About';
import {UsersList, UsersAdd, UsersEdit, UsersView} from './pages/users/Users';
import {PerfilList, PerfilAdd, PerfilEdit, PerfilView} from './pages/perfil/Perfil';

import Login from './pages/login/Login';
import Register from "./pages/register/Register";

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

							<PrivateRoute path="/usuario/list" component={ (privateRouteProps) => (<UsersList {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/usuario/add" component={ (privateRouteProps) => (<UsersAdd {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/usuario/edit" component={ (privateRouteProps) => (<UsersEdit {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/usuario/view" component={ (privateRouteProps) => (<UsersView {...privateRouteProps} {...props} />) } />

							<PrivateRoute path="/perfil/list" component={ (privateRouteProps) => (<PerfilList {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/perfil/add" component={ (privateRouteProps) => (<PerfilAdd {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/perfil/edit" component={ (privateRouteProps) => (<PerfilEdit {...privateRouteProps} {...props} />) } />
							<PrivateRoute path="/perfil/view" component={ (privateRouteProps) => (<PerfilView {...privateRouteProps} {...props} />) } />
							

						
							<Route path="/login" component={ Login } />
							<Route path="/register" component={ Register } />

						</Switch>
				}
				
			</MasterLayout>
		</Router>
	);
}

/*----------------------------------------------------------------------------------------------------*/

export default Routes;