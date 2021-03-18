import React from 'react';
import BasePageList from '../basePage/BasePageList';
import BasePageForm from '../basePage/BasePageForm';
import MessageService from '../../services/MessageService';
import {TableData, FormPage, FormRow, BasicView, Filter} from '../../components/template/Layout';
import { ButtonSubmit, ButtonCancel, InputInGroup, SelectField, InputCep, InputCpf, Select2Field, InputPis } from '../../components/template/Form';
import {Redirect} from "react-router-dom";
import RestService from "../../services/RestService";
const Rest = new RestService();

const Messages = new MessageService();

class PessoaList extends BasePageList 
{
	static defaultProps = {
		urlBase: 'pessoa/all',
		title: 'menu.pessoa.title',
		fields: [
			{
				label: "page.pessoa.fields.id",
				field: "id",
				width: "5%"
			},
			{
				label: 'page.pessoa.fields.nome',
				field: "nome",
				width: "41%"	
			},
			{
				label: 'page.pessoa.fields.cpf',
				field: "cpf",
				width: "22%"	
			},
			{
				label: 'page.pessoa.fields.pis',
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
			<TableData onClickPage={ this.handleClickPage } title='page.pessoa.list.title' 
				fields={ this.props.fields } data={ this.state.itens } pagination={ this.state.pagination }
				actions={ this.state.actions } addUrl='/pessoa/add' onEdit={ this.handleOnEditAction }
				onDelete={ this.handleOnDeleteAction } onView={ this.handleOnViewAction } filter={filter}/>
		);
	}

}

/*----------------------------------------------------------------------------------------------------*/

class PessoaAdd extends BasePageForm 
{
	static defaultProps = {
		urlBase: 'pessoa/add',
		title: Messages.getMessage('menu.pessoa.title')
	};

	render() 
	{	
		return (
			<FormPage title="page.pessoa.add.title">
				<FormRow>
					<InputInGroup  name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.nome' required="required" colsize="4" />
					<InputCpf  value={this.state.cpf} name="cpf" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.cpf' required="required" colsize="4" />
					<InputPis value={this.state.pis} name="pis" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.pis' required="required" colsize="4" />
				</FormRow>
			
				<FormRow>
					<InputCep value={this.state.cep} name="cep" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.cep' required="required" colsize="2" />
					<InputInGroup  name="rua" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.rua' required="required" colsize="3" />
					<InputInGroup  name="numero" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.numero' required="required" colsize="1" />
                    <InputInGroup  name="complemento" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.complemento' colsize="2" />
                    <Select2Field name="cidade_id" colsize="4" onChange={this.handleChange} url_view="cidade/view" url_list="cidade/all" filterName="nome" 
                        displayName={["nome"]} label="page.pessoa.fields.cidade_id" required={true} errors={this.state.fieldErrors} />
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

class PessoaEdit extends BasePageForm 
{	
	static defaultProps = {
		urlBase: 'pessoa/edit',
		title: Messages.getMessage('menu.pessoa.title')
	};

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.get( "pessoa/view/" + id, this.state).then(this.handleResponse);
	}


	render() 
	{	
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				<FormPage title="page.pessoa.add.title">
			    <FormRow>
					<InputInGroup  value={this.state.nome} name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.nome' required="required" colsize="4" />
					<InputCpf  value={this.state.cpf} name="cpf" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.cpf' required="required" colsize="4" />
					<InputPis  value={this.state.pis} name="pis" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.pis' required="required" colsize="4" />
				</FormRow>
			
				<FormRow>
					<InputCep  value={this.state.cep} name="cep" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.cep' required="required" colsize="2" />
					<InputInGroup  value={this.state.rua} name="rua" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.rua' required="required" colsize="3" />
					<InputInGroup  value={this.state.numero} name="numero" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.numero' required="required" colsize="1" />
                    <InputInGroup  value={this.state.complemento} name="complemento" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.pessoa.fields.complemento' colsize="2" />
                    <Select2Field value={this.state.cidade_id} name="cidade_id" colsize="4" onChange={this.handleChange} url_view="cidade/view" url_list="cidade/all" filterName="nome" 
                        displayName={["nome"]} label="page.pessoa.fields.cidade_id" required={true} errors={this.state.fieldErrors} />
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

class PessoaView extends BasePageForm
{
	static defaultProps = {
		urlBase: 'pessoa/view',
		title: Messages.getMessage('menu.pessoa.title')
	};

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.get( "pessoa/view/" + id, this.state).then(this.handleResponse);
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
				(<BasicView title={"Pessoa " + this.state.nome} url={"#pessoa/edit?id=" + this.state.id} fields={fields} onClickEdit={this.onClickEdit}/>)
		);
	}
}


export { PessoaList, PessoaAdd , PessoaEdit,  PessoaView} ;