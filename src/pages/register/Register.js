import React, { Component } from 'react';
import { AlertifyError, AlertifySuccess } from '../../services/AlertifyService';
import { CenterCard, FormRow } from '../../components/template/Layout';
import { InputInGroup, ButtonSubmit, InputCpf, InputCep, ButtonCancel, InputPis } from '../../components/template/Form';
import { Select2Field } from '../../components/template/FormUnsecure';

import RestServiceUnsecure from '../../services/RestServiceUnsecure';


const Rest = new RestServiceUnsecure();


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
				AlertifyError([{"message": res.data.message}]);
			}

    	} else {
            AlertifySuccess([{message: res.data.message}]);
            this.props.history.push('/login');
        }
    }

    async handleOnSubmit(e) {
			
		var errors = {"has": false}


		if (this.state.email !== this.state.email_confirm) {
			errors["email_confirm"] = "O endereço de email é diferente.";
			errors["has"] = true;
		}if (this.state.senha !== this.state.senha_confirm) {
			errors["senha_confirm"] = "A senha é diferente."
			errors["has"] = true;
		}
		

		if (errors["has"]){
			this.setState({
				fieldErrors: {...this.state.fieldErrors, ...errors}
			})
		}else{
			Rest.post("usuario/cadastro", this.state).then(this.handleReceiveResponseRest);

		  }
    
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
                        <InputInGroup type="email" name="email_confirm" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                            label='page.user.fields.email_confirm' required="required" colsize="6" />
                  
                    </FormRow>
                    <FormRow>
                        <InputInGroup type="password" name="senha" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
                            label='page.user.fields.password' required="required" colsize="6" />
                        <InputInGroup type="password" name="senha_confirm" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
                            label='page.user.fields.password_confirm' required="required" colsize="6" />
                    </FormRow>

                    <hr />

			    <FormRow>
					<InputInGroup  value={this.state.nome} name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.nome' required="required" colsize="12" />
				</FormRow>
            
                <FormRow>
                    <InputCpf  value={this.state.cpf} name="cpf" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.cpf' required="required" colsize="6" />
					<InputPis  value={this.state.pis} name="pis" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.pis' required="required" colsize="6" />

                </FormRow>

                <FormRow>
                	<InputCep street_name={"rua"} value={this.state.cep} name="cep" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.cep' required="required" colsize="6" />
					<InputInGroup  value={this.state.rua} name="rua" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.rua' required="required" colsize="6" />
                </FormRow>
				<FormRow>
					<InputInGroup  value={this.state.numero} name="numero" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.numero' required="required" colsize="6" />
                    <InputInGroup  value={this.state.complemento} name="complemento" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.complemento' colsize="6" />
            	</FormRow>
                <FormRow>
                    <Select2Field value={this.state.cidade_id} name="cidade_id" colsize="12" onChange={this.handleChange} url_view="cidade/view" url_list="cidade/all" filterName="nome" 
                        displayName={["nome"]} label="page.perfil.fields.cidade_id" required={true} errors={this.state.fieldErrors} />
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
                [e.target.name]: e.target.value,
				fieldErrors: []
            }
        )
    }

}

export default Register;