import React from 'react';
import BasePageList from '../basePage/BasePageList';
import BasePageForm from '../basePage/BasePageForm';
import MessageService from '../../services/MessageService';
import {TableData, FormPage, FormRow, BasicView, Filter, CenterCard} from '../../components/template/Layout';
import { ButtonSubmit, ButtonCancel, InputInGroup, SelectField, InputCep, InputCpf, Select2Field, InputPis, SimpleModal } from '../../components/template/Form';
import {Redirect} from "react-router-dom";
import RestService from "../../services/RestService";
const Rest = new RestService();

const Messages = new MessageService();

class PerfilList extends BasePageList 
{
	static defaultProps = {
		urlBase: 'perfil/all',
		title: 'menu.perfil.title',
		fields: [
			{
				label: "page.perfil.fields.id",
				field: "id",
				width: "5%"
			},
			{
				label: 'page.perfil.fields.nome',
				field: "nome",
				width: "41%"	
			},
			{
				label: 'page.perfil.fields.cpf',
				field: "cpf",
				width: "22%"	
			},
			{
				label: 'page.perfil.fields.pis',
				field: "pis",
				width: "22%"	
			}
		]
	};

	render() 
	{
		let input_fields = [];
		let filter = <Filter fields={input_fields} onChange={this.handleChange} onSubmit={this.handleOnSubmitFilter}/>;
		return (
			<TableData onClickPage={ this.handleClickPage } title='page.perfil.list.title' 
				fields={ this.props.fields } data={ this.state.itens } pagination={ this.state.pagination }
				actions={ this.state.actions } addUrl='/perfil/add' onEdit={ this.handleOnEditAction }
				onDelete={ this.handleOnDeleteAction } onView={ this.handleOnViewAction } filter={filter}/>
		);
	}

}

/*----------------------------------------------------------------------------------------------------*/

class PerfilAdd extends BasePageForm 
{
	static defaultProps = {
		urlBase: 'perfil/add',
		title: Messages.getMessage('menu.perfil.title')
	};

	render() 
	{	
		return (
			<FormPage title="page.perfil.add.title">
				<FormRow>
					<InputInGroup  name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.nome' required="required" colsize="4" />
					<InputCpf  value={this.state.cpf} name="cpf" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.cpf' required="required" colsize="4" />
					<InputPis value={this.state.pis} name="pis" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.pis' required="required" colsize="4" />
				</FormRow>
			
				<FormRow>
					<InputCep street_name={"rua"} value={this.state.cep} name="cep" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.cep' required="required" colsize="2" />
					<InputInGroup  value={this.state.rua} name="rua" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.rua' required="required" colsize="3" />
					<InputInGroup  name="numero" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.numero' required="required" colsize="1" />
                    <InputInGroup  name="complemento" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.complemento' colsize="2" />
                    <Select2Field name="cidade_id" colsize="4" onChange={this.handleChange} url_view="cidade/view" url_list="cidade/all" filterName="nome" 
                        displayName={["nome"]} label="page.perfil.fields.cidade_id" required={true} errors={this.state.fieldErrors} />
				</FormRow>
				<FormRow>
					<ButtonSubmit text="layout.form.save" onClick={ this.handleOnSubmit } />
					<ButtonCancel text="layout.form.cancel" onClick={ this.handleCancel } />
				</FormRow>
			</FormPage>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class PerfilEdit extends BasePageForm 
{	
	static defaultProps = {
		urlBase: 'perfil/edit',
		title: Messages.getMessage('menu.perfil.title')
	};

	componentDidMount() {
		

		let id = this.props.location.state.item_id;
		Rest.get( "perfil/view/" + id, this.state).then(this.handleResponse);
	}


	render() 
	{	
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				<FormPage title="page.perfil.edit.title">
			    <FormRow>
					<InputInGroup  value={this.state.nome} name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.nome' required="required" colsize="4" />
					<InputCpf  value={this.state.cpf} name="cpf" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.cpf' required="required" colsize="4" />
					<InputPis  value={this.state.pis} name="pis" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.pis' required="required" colsize="4" />
				</FormRow>
			
				<FormRow>
					<InputCep  street_name={"rua"} value={this.state.cep} name="cep" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.cep' required="required" colsize="2" />
					<InputInGroup  value={this.state.rua} name="rua" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.rua' required="required" colsize="3" />
					<InputInGroup  value={this.state.numero} name="numero" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.numero' required="required" colsize="1" />
                    <InputInGroup  value={this.state.complemento} name="complemento" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.perfil.fields.complemento' colsize="2" />
                    <Select2Field value={this.state.cidade_id} name="cidade_id" colsize="4" onChange={this.handleChange} url_view="cidade/view" url_list="cidade/all" filterName="nome" 
                        displayName={["nome"]} label="page.perfil.fields.cidade_id" required={true} errors={this.state.fieldErrors} />
				</FormRow>
				<FormRow>
					<ButtonSubmit text="layout.form.save" onClick={ this.handleOnSubmitEdit } />
					<ButtonCancel text="layout.form.cancel" onClick={ this.handleCancel } />
				</FormRow>
			</FormPage>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class PerfilView extends BasePageForm
{
	static defaultProps = {
		urlBase: 'perfil/view',
		title: Messages.getMessage('menu.perfil.title')
	};

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.get( "perfil/view/" + id, this.state).then(this.handleResponse);
	}

	render()
	{
		let fields = [
			{label:"Nome: ", value:this.state.nome},			
            {label:"CPF: ", value:this.state.cpf},			
            {label:"PIS: ", value:this.state.pis},			
            {label:"CEP: ", value:this.state.cep},			
			{label:"Rua: ", value:this.state.rua},			
            {label:"Número: ", value:this.state.numero},
            {label:"Complemento: ", value:this.state.complemento},			


		];
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				(<BasicView title={"Perfil " + this.state.nome} url={"#perfil/edit?id=" + this.state.id} fields={fields} onClickEdit={this.onClickEdit}/>)
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class PerfilMe extends BasePageForm 
{	
	constructor(props){
		super(props);
		this.handleProfile = this.handleProfile.bind(this);
	}

	static defaultProps = {
		urlBase: 'perfil/edit',
		title: Messages.getMessage('menu.perfil.title')
	};

	componentDidMount() {
		Rest.get("me",).then(this.handleProfile);
	}

	handleProfile(res){
		this.setState({
			...res.data.perfil	
		})
	}

  	handleCancel(e) {
		console.log("Deletar")
		//this.props.history.push("/" + this.props.urlBase.split('/')[0] + '/list');
    }
	
	render() 
	{	
		return (
			this.props.role == "1"?
				( <Redirect to={{ pathname: "/", state: { from: this.props.location } }}/> ) :
				<React.Fragment>
					<FormPage title="page.perfil.edit.title">
					<FormRow>
						<InputInGroup  value={this.state.nome} name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
							label='page.perfil.fields.nome' required="required" colsize="4" />
						<InputCpf  value={this.state.cpf} name="cpf" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
							label='page.perfil.fields.cpf' required="required" colsize="4" />
						<InputPis  value={this.state.pis} name="pis" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
							label='page.perfil.fields.pis' required="required" colsize="4" />
					</FormRow>
				
					<FormRow>
						<InputCep  street_name={"rua"} value={this.state.cep} name="cep" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
							label='page.perfil.fields.cep' required="required" colsize="2" />
						<InputInGroup  value={this.state.rua} name="rua" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
							label='page.perfil.fields.rua' required="required" colsize="3" />
						<InputInGroup  value={this.state.numero} name="numero" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
							label='page.perfil.fields.numero' required="required" colsize="1" />
						<InputInGroup  value={this.state.complemento} name="complemento" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
							label='page.perfil.fields.complemento' colsize="2" />
						<Select2Field value={this.state.cidade_id} name="cidade_id" colsize="4" onChange={this.handleChange} url_view="cidade/view" url_list="cidade/all" filterName="nome" 
							displayName={["nome"]} label="page.perfil.fields.cidade_id" required={true} errors={this.state.fieldErrors} />
					</FormRow>
					<FormRow>
						<ButtonSubmit text="layout.form.save" onClick={ this.handleOnSubmitEdit } />
						<ButtonCancel text="layout.form.cancel" onClick={ this.openModal } />
					</FormRow>
				</FormPage>
				<SimpleModal
					isOpen={this.state.modal}
					onRequestClose={this.closeModal}
				>	
				<CenterCard title="page.perfil.edit.title">
					<p>Tem certeza que deseja apagar seu usuário?</p>
					<FormRow>
						<ButtonSubmit text="layout.form.save" onClick={ this.handleCancel } />
						<ButtonCancel text="layout.form.cancel" onClick={ this.closeModal } />

					</FormRow>

				</CenterCard>
					
				</SimpleModal>
			</React.Fragment>
		);
	}
}


export { PerfilList, PerfilAdd , PerfilEdit,  PerfilView, PerfilMe} ;