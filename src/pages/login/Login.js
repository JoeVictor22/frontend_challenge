import React, { Component } from 'react';
import AuthService from '../../services/AuthService';
import MessageService from '../../services/MessageService';
import { AlertifyError, AlertifySuccess } from '../../services/AlertifyService';
import { CenterCard } from '../../components/template/Layout';
import { InputInGroup, RememberMeInGroup, ButtonSubmit } from '../../components/template/Form';

const Message = new MessageService();

class Login extends Component 
{

	constructor() 
	{
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.Auth = new AuthService();
		this.state = {
			fieldErrors: [],
		}; 
	}
	
	render()
	{
		return (
			<CenterCard title='page.user.login.title'>
				<form onSubmit={ this.handleSubmit }>
					<InputInGroup type="text" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.username' required="required" autofocus="autofocus" />
					<InputInGroup type="password" name="senha" errors={ this.state.fieldErrors } onChange={ this.handleChange } 
						label='page.user.fields.password' required="required" />
					
					<ButtonSubmit type="submit" text='page.user.login.submit' />
				</form>
			</CenterCard>
		);
	}

	handleChange(e)
	{
        this.setState({
                [e.target.name]: e.target.value
            }
        )
    }

    handleErrorLogin(errors)
    {
		console.log("errors login", errors)
		let arrErrors = [];
			
		if (errors.validation_error){
			let array = errors.validation_error.body_params;
			for (const item of array){
				arrErrors[item.loc[0]] = item.msg;
			}
		}

        this.setState({
            fieldErrors: arrErrors,
        });

        AlertifyError(errors.form);
    }

    handleSubmit(e) 
    {
    	e.preventDefault();
    	this.Auth.login(this.state.email, this.state.senha)
    		.then(res => {
    			if (res.data.error)
    			{
    				this.handleErrorLogin(res.data);
    			} else {
    				AlertifySuccess([{message: Message.getMessage('page.user.login.success')}]);
                    this.props.history.push('/');
    			}
    		})
    		.catch(err=> {
    			console.log(err);
    		})
    }

    componentWillMount()
    {
    	if(this.Auth.loggedIn()) {
    		this.props.history.push('/');
    	}
    }

}

export default Login;