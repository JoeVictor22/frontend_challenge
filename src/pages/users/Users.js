import React from 'react';
import BasePageList from '../basePage/BasePageList';
import BasePageForm from '../basePage/BasePageForm';
import MessageService from '../../services/MessageService';
import {TableData, FormPage, FormRow, BasicView, Filter, CenterCard} from '../../components/template/Layout';
import { ButtonSubmit, ButtonCancel, InputInGroup, SelectField, Select2Field, SimpleModal } from '../../components/template/Form';
import {Redirect} from "react-router-dom";
import RestService from "../../services/RestService";
import { Icons } from '../../iconSet';
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
	constructor(props){
		super(props);
	}
	static defaultProps = {
		urlBase: 'usuario/add',
		title: Messages.getMessage('menu.user.title')
	};

    async handleOnSubmit(e) {
		if (this.state.email !== this.state.email_confirm) {
			this.setState({
			  fieldErrors: {
				email_confirm: "O endereço de email é diferente.",
			  },
			});
		  }else if (this.state.senha !== this.state.senha_confirm) {
			this.setState({
			  fieldErrors: {
				senha_confirm: "A senha é diferente.",
			  },
			});
		  }else{
			console.log("submit", this.state)
			Rest.post(this.props.urlBase, this.state).then(this.handleReceiveResponseRest);
		  }

    }
	render() 
	{	
		return (
			<FormPage title="page.user.add.title">
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
				<FormRow>
					<SelectField empty={ true } value_name="id" name='cargo_id' errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.role' required="required" colsize="6" url="cargo/all" />
					{this.state.cargo_id == 2 ? 
					<Select2Field value={this.state.perfil_id} name="perfil_id" colsize="6" onChange={this.handleChange} url_view="perfil/view" url_list="perfil/all" filterName="nome" 
						displayName={["nome", "cpf", "pis"]} label="page.user.fields.perfil_id" errors={this.state.fieldErrors} />
					: ""}
					
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

	async handleOnSubmitEdit(e) {
		if (this.state.email !== this.state.email_confirm) {
			this.setState({
			  fieldErrors: {
				email_confirm: "O endereço de email é diferente.",
			  },
			});
		  }else{
			console.log("submit edit", this.state)
			Rest.put(this.props.urlBase + "/" + this.state.id, this.state).then(
				this.handleReceiveResponseRest
			);
		  }
	}

	render() 
	{	
		return (
			this.state.error ?
				( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
				<FormPage title="page.user.edit.title">
				<FormRow>
					<InputInGroup value={this.state.email} type="email" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.email' required="required" colsize="6" />
					<InputInGroup type="email" name="email_confirm" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.email_confirm' required="required" colsize="6" />
				
				</FormRow>

				<FormRow>
					<SelectField empty={ true } name="cargo_id" value_name="id" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
						label='page.user.fields.role' required="required" colsize="6" url="cargo/all" value={this.state.cargo_id} />
					
					{this.state.cargo_id == 2 ? 
					<Select2Field value={this.state.perfil_id} name="perfil_id" colsize="6" onChange={this.handleChange} url_view="perfil/view" url_list="perfil/all" filterName="nome" 
							displayName={["nome", "cpf", "pis"]} label="page.user.fields.perfil_id"  errors={this.state.fieldErrors} />
					: ""}
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

/*----------------------------------------------------------------------------------------------------*/

class UsersMe extends BasePageForm 
{	
	constructor(props){
		super(props);
		this.handleProfile = this.handleProfile.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	static defaultProps = {
		urlBase: 'usuario/edit',
		title: Messages.getMessage('menu.user.title')
	};

	componentDidMount() {
		Rest.get("me",).then(this.handleProfile);
	}

	handleProfile(res){
		this.setState({
			...res.data
		})
	}

  	handleDelete(e) {
		Rest.delete("usuario/delete/" + this.state.id,).then(this.handleReceiveResponse).then((res) => {
			if(!res.data.error){
				this.props.logout()
			}
		});
    }
	async handleOnSubmitEdit(e) {
		console.log("submit edit", this.state)

		
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
			Rest.put(this.props.urlBase + "/" + this.state.id, this.state).then(this.handleReceiveResponse);
		}


	}
	render() 
	{	
		return (
			this.state.error?
				( <Redirect to={{ pathname: "/", state: { from: this.props.location } }}/> ) :
				
				<React.Fragment>
					<FormPage title="page.user.edit.title">
					{this.state.id ?
					<React.Fragment> 
						<FormRow>
							<InputInGroup type="email" name="email" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
								label='page.user.fields.email' required="required" colsize="6" value={this.state.email}/>
							<InputInGroup type="email" name="email_confirm" errors={ this.state.fieldErrors }  onChange={ this.handleChange } 
								label='page.user.fields.email_confirm' required="required" colsize="6"/>

						</FormRow>
						<FormRow>
							<InputInGroup type="password" name="senha" errors={ this.state.fieldErrors } onChange={ this.handleChange } 
								label='page.user.fields.password' required="required"  colsize="6"/>
							<InputInGroup type="password" name="senha_confirm" errors={ this.state.fieldErrors } onChange={ this.handleChange } 
								label='page.user.fields.password_confirm' required="required"  colsize="6"/>
						</FormRow>

						<FormRow>
							<ButtonSubmit text="layout.form.save" onClick={ this.handleOnSubmitEdit } />
							<ButtonCancel text="layout.form.delete" onClick={ this.openModal } />
						</FormRow>
					</React.Fragment>
				: 
				<div className="card-body">
					<h3 style={{ textAlign: "center" }}>
						<i className={Icons.loading} /> Carregando...
					</h3>
				</div>
				}
				</FormPage>
				
				<SimpleModal
					isOpen={this.state.modal}
					onRequestClose={this.closeModal}
				>	
				<CenterCard title="layout.form.confirm">
					<p>Tem certeza que deseja apagar seu usuário?</p>
					<FormRow>
						<ButtonSubmit text="layout.form.yes" onClick={ this.handleDelete } />
						<ButtonCancel text="layout.form.no" onClick={ this.closeModal } />

					</FormRow>

				</CenterCard>
					
				</SimpleModal>
			</React.Fragment>
		);
	}
}

export { UsersList, UsersAdd , UsersEdit,  UsersView, UsersMe} ;