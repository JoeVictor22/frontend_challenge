import React from 'react';
import BasePageList from '../basePage/BasePageList';
import BasePageForm from '../basePage/BasePageForm';
import MessageService from '../../services/MessageService';
import {TableData, FormPage, FormRow, BasicView, Filter} from '../../components/template/Layout';
import { ButtonSubmit, ButtonCancel, InputInGroup, SelectField } from '../../components/template/Form';
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
				width: "95%"	
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
						label='page.pessoa.fields.nome' required="required" colsize="6" />
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
					<InputInGroup name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.pessoa.fields.nome' required="required" colsize="6" value={this.state.nome}/>
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
			{label:"Pessoa: ", value:this.state.nome}			
		];
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				(<BasicView title={"Pessoa " + this.state.nome} url={"#pessoa/edit?id=" + this.state.id} fields={fields} onClickEdit={this.onClickEdit}/>)
		);
	}
}


export { PessoaList, PessoaAdd , PessoaEdit,  PessoaView} ;