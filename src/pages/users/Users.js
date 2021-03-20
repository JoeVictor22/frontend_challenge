import React from 'react';
import BasePageList from '../basePage/BasePageList';
import BasePageForm from '../basePage/BasePageForm';
import MessageService from '../../services/MessageService';
import {TableData, FormPage, FormRow, BasicView, Filter} from '../../components/template/Layout';
import { ButtonSubmit, ButtonCancel, InputInGroup, SelectField, Select2Field } from '../../components/template/Form';
import {Redirect} from "react-router-dom";
import RestService from "../../services/RestService";
const Rest = new RestService();

const Messages = new MessageService();

class UsersList extends BasePageList 
{
	static defaultProps = {
		urlBase: 'usuario/all',
		title: 'menu.user.title',
		fields: [
			{
				label: "page.user.fields.id",
				field: "id",
				width: "5%"
			},
			{
				label: 'page.user.fields.email',
				field: "email",
				width: "95%"	
			}
		]
	};

	render() 
	{
		let input_fields = [{label: 'page.user.fields.email', field: "email"}];
		let filter = <Filter fields={input_fields} onChange={this.handleChange} onSubmit={this.handleOnSubmitFilter}/>;
		return (
			<TableData onClickPage={ this.handleClickPage } title='page.user.list.title' 
				fields={ this.props.fields } data={ this.state.itens } pagination={ this.state.pagination }
				actions={ this.state.actions } addUrl='/usuario/add' onEdit={ this.handleOnEditAction }
				onDelete={ this.handleOnDeleteAction } onView={ this.handleOnViewAction } filter={filter}/>
		);
	}

}

/*----------------------------------------------------------------------------------------------------*/

class UsersAdd extends BasePageForm 
{
	static defaultProps = {
		urlBase: 'usuario/add',
		title: Messages.getMessage('menu.user.title')
	};

	render() 
	{	
		return (
			<FormPage title="page.user.add.title">
				<FormRow>
					<InputInGroup type="email" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.email' required="required" colsize="6" />
				</FormRow>
				<FormRow>
					<InputInGroup type="password" name="senha" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.password' required="required" colsize="6" />
				</FormRow>

				<FormRow>
					<SelectField empty={ true } value_name="id" name='cargo_id' errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.role' required="required" colsize="6" url="cargo/all" />
					<Select2Field value={this.state.perfil_id} name="perfil_id" colsize="6" onChange={this.handleChange} url_view="perfil/view" url_list="perfil/all" filterName="nome" 
							displayName={["nome", "cpf", "pis"]} label="page.usuario.fields.perfil_id" required={true} errors={this.state.fieldErrors} />
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

class UsersEdit extends BasePageForm 
{	
	static defaultProps = {
		urlBase: 'usuario/edit',
		title: Messages.getMessage('menu.user.title')
	};

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.get( "usuario/view/" + id, this.state).then(this.handleResponse);
	}


	render() 
	{	
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				<FormPage title="page.user.edit.title">
				<FormRow>
					<InputInGroup type="email" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.email' required="required" colsize="6" value={this.state.email}/>
				</FormRow>
				<FormRow>
					<SelectField empty={ true } name="cargo_id" value_name="id" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.role' required="required" colsize="6" url="cargo/all" value={this.state.cargo_id} />
					<Select2Field value={this.state.perfil_id} name="perfil_id" colsize="6" onChange={this.handleChange} url_view="perfil/view" url_list="perfil/all" filterName="nome" 
							displayName={["nome", "cpf", "pis"]} label="page.user.fields.perfil_id" required={true} errors={this.state.fieldErrors} />
	
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

class UsersView extends BasePageForm
{
	static defaultProps = {
		urlBase: 'usuario/view',
		title: Messages.getMessage('menu.user.title')
	};

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.get( "usuario/view/" + id, this.state).then(this.handleResponse);
	}

	render()
	{
		let fields = [
			{label:"Email: ", value:this.state.email},
			{label:"Cargo: ", value:this.state.cargo_id}
		];
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				(<BasicView title={"User " + this.state.email} url={"#usuario/edit?id=" + this.state.id} fields={fields} onClickEdit={this.onClickEdit}/>)
		);
	}
}


export { UsersList, UsersAdd , UsersEdit,  UsersView} ;