import React, { Component } from 'react';
import AuthService from '../../services/AuthService';
import MessageService from '../../services/MessageService';
import { AlertifyError, AlertifySuccess } from '../../services/AlertifyService';
import { CenterCard, FormRow } from '../../components/template/Layout';
import { InputInGroup, ButtonSubmit } from '../../components/template/Form';

const Message = new MessageService();

class Login extends Component 
{

	constructor() 
	{
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.registerPage = this.registerPage.bind(this);
		this.Auth = new AuthService();
		this.state = {
			fieldErrors: [],
		}; 
	}
	

	registerPage() {
		this.props.history.push("/register");
	}
	
	render()
	{
		return (
			<CenterCard title='page.user.login.title'>
				<form onSubmit={ this.handleSubmit }>
					<InputInGroup placeholder="email, CPF ou PIS" type="text" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.login' required="required" autofocus="autofocus" />
					<InputInGroup placeholder="Digite sua senha" type="password" name="senha" errors={ this.state.fieldErrors } onChange={ this.handleChange } 
						label='page.user.fields.password' required="required" />
					
					<FormRow>
						<ButtonSubmit type="submit" text='page.user.login.submit' />
						<ButtonSubmit onClick={this.registerPage} text='page.user.register.submit' />
					</FormRow>
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