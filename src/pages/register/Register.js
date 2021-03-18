import React, { Component } from 'react';
import AuthService from '../../services/AuthService';
import MessageService from '../../services/MessageService';
import { AlertifyError, AlertifySuccess } from '../../services/AlertifyService';
import { CenterCard, FormPage, FormRow } from '../../components/template/Layout';
import { InputInGroup, RememberMeInGroup, ButtonSubmit, SelectField, InputCpf, InputCep, ButtonCancel, InputPis } from '../../components/template/Form';
import { Select2Field } from '../../components/template/FormUnsecure';

import RestServiceUnsecure from '../../services/RestServiceUnsecure';

const Message = new MessageService();

const Rest = new RestServiceUnsecure();
const Auth = new AuthService();


class Register extends Component 
{
	constructor() 
	{
		super();
		this.handleChange = this.handleChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this); 
        this.handleReceiveResponseRest = this.handleReceiveResponseRest.bind(this);
		this.state = {
			fieldErrors: [],
		}; 
	}

    handleReceiveResponseRest(res)
    {
        if (res.data.error)
    	{
			console.log("errors basePageForm", res.data)

			let arrErrors = [];
    		if (res.data.validation_error !== undefined) {
				if (res.data.validation_error){
					let array = res.data.validation_error.body_params;
					for (const item of array){
						arrErrors[item.loc[0]] = item.msg;
					}
				}
				this.setState({
					fieldErrors: arrErrors,
				});
				AlertifyError([{"message": "Ocorreram errors durante a validação de alguns dados, verifique o formulário e tente novamente."}]);

			} 
			if (res.data.form){
				AlertifyError(res.data.form);
			}
			if (res.data.message){
				console.log("vai");
				AlertifyError([{"message": res.data.message}]);
			}

    	} else {
            AlertifySuccess([{message: res.data.message}]);
            this.props.history.push('/login');
        }
    }

    async handleOnSubmit(e) {
		console.log("submit", this.state)
    	Rest.post("usuario/cadastro", this.state).then(this.handleReceiveResponseRest);
    
    }
	
    handleCancel(e) {
        this.props.history.push("/login");
    }

	render()
	{
		return (
			<React.Fragment>
                <CenterCard title="page.user.add.title">

                    <FormRow>
                        <InputInGroup type="email" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                            label='page.user.fields.email' required="required" colsize="6" />
                        <InputInGroup type="email" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                            label='page.user.fields.email' required="required" colsize="6" />
                  
                    </FormRow>
                    <FormRow>
                        <InputInGroup type="password" name="senha" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
                            label='page.user.fields.password' required="required" colsize="6" />
                        <InputInGroup type="password" name="senha" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
                            label='page.user.fields.password' required="required" colsize="6" />
                    </FormRow>

                    <hr />

			    <FormRow>
					<InputInGroup  value={this.state.nome} name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.nome' required="required" colsize="12" />
				</FormRow>
            
                <FormRow>
                    <InputCpf  value={this.state.cpf} name="cpf" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.cpf' required="required" colsize="6" />
					<InputPis  value={this.state.pis} name="pis" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.pis' required="required" colsize="6" />

                </FormRow>

                <FormRow>
                <InputCep value={this.state.cep} name="cep" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.cep' required="required" colsize="6" />
					<InputInGroup  value={this.state.rua} name="rua" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.rua' required="required" colsize="6" />
                </FormRow>
				<FormRow>
					<InputInGroup  value={this.state.numero} name="numero" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.numero' required="required" colsize="6" />
                    <InputInGroup  value={this.state.complemento} name="complemento" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.complemento' colsize="6" />
            	</FormRow>
                <FormRow>
                    <Select2Field value={this.state.cidade_id} name="cidade_id" colsize="12" onChange={this.handleChange} url_view="cidade/view" url_list="cidade/all" filterName="nome" 
                        displayName={["nome"]} label="page.pessoa.fields.cidade_id" required={true} errors={this.state.fieldErrors} />
                </FormRow>
                <FormRow>
                    <ButtonSubmit text='page.user.register.submit' onClick={ this.handleOnSubmit }/>
                    <ButtonCancel text="layout.form.cancel" onClick={ this.handleCancel } />
                </FormRow>
			</CenterCard>
        </React.Fragment>
		);
	}

	handleChange(e)
	{
        this.setState({
                [e.target.name]: e.target.value
            }
        )
    }

}

export default Register;