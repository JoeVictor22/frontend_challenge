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

class UsersList extends BasePageList 
{
	static defaultProps = {
		urlBase: 'user/all',
		title: 'menu.user.title',
		fields: [
			{
				label: "page.user.fields.id",
				field: "id",
				width: "5%"
			},
			{
				label: 'page.user.fields.username',
				field: "username",
				width: "95%"	
			}
		]
	};

	render() 
	{
		let input_fields = [{label: 'page.user.fields.username', field: "username"}];
		let filter = <Filter fields={input_fields} onChange={this.handleChange} onSubmit={this.handleOnSubmitFilter}/>;
		return (
			<TableData onClickPage={ this.handleClickPage } title='page.user.list.title' 
				fields={ this.props.fields } data={ this.state.itens } pagination={ this.state.pagination }
				actions={ this.state.actions } addUrl='/user/add' onEdit={ this.handleOnEditAction }
				onDelete={ this.handleOnDeleteAction } onView={ this.handleOnViewAction } filter={filter}/>
		);
	}

}

/*----------------------------------------------------------------------------------------------------*/

class UsersAdd extends BasePageForm 
{
	static defaultProps = {
		urlBase: 'user/add',
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
					<InputInGroup type="text" name="username" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.username' required="required" colsize="6" />
				</FormRow>
				<FormRow>
					<InputInGroup type="password" name="password" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.password' required="required" colsize="6" />
				</FormRow>

				<FormRow>
					<SelectField empty={ true } value_name="id" name='role_id' errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.role' required="required" colsize="6" url="roles/all" />
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
	constructor(props) {
		super(props);

		this.handleResponse = this.handleResponse.bind(this);
	}
	static defaultProps = {
		urlBase: 'user/edit',
		title: Messages.getMessage('menu.user.title')
	};

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.view( "user/view/" + id, this.state).then(this.handleResponse);
	}

	handleResponse(data) {
		this.setState((
			data.data
		));
	}
	render() 
	{	
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				<FormPage title="page.user.add.title">
				<FormRow>
					<InputInGroup type="email" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.email' required="required" colsize="6" value={this.state.email}/>
				</FormRow>
				<FormRow>
					<InputInGroup type="text" name="username" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
						label='page.user.fields.username' required="required" colsize="6" value={this.state.username}/>
				</FormRow>

				<FormRow>
					<SelectField empty={ true } name="name" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.role' required="required" colsize="6" url="roles/all" />
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

class UsersView extends BasePageForm
{

	constructor(props) {
		super(props);

		this.handleResponse = this.handleResponse.bind(this);
		this.onClickEdit = this.onClickEdit.bind(this);
	}
	onClickEdit(event) {
		console.log(event.target);
		let url = "edit";
		let id = this.state.id;
		this.props.history.push({
			pathname: url,
			state: {item_id: id}
		});
	}
	static defaultProps = {
		urlBase: 'user/view',
		title: Messages.getMessage('menu.user.title')
	};

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.view( "user/view/" + id, this.state).then(this.handleResponse);
	}

	handleResponse(data) {
		this.setState((
			data.data
		));
	}
	render()
	{
		let fields = [{label:"Email: ", value:this.state.email}];
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				(<BasicView title={"Users " + this.state.username} url={"#user/edit?id=" + this.state.id} fields={fields} onClickEdit={this.onClickEdit}/>)
		);
	}
}


export { UsersList, UsersAdd , UsersEdit,  UsersView} ;