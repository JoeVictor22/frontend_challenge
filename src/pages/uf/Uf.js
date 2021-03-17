import React from 'react';
import BasePageList from '../basePage/BasePageList';
import BasePageForm from '../basePage/BasePageForm';
import MessageService from '../../services/MessageService';
import {TableData, FormPage, FormRow, BasicView, Filter} from '../../components/template/Layout';
import { ButtonSubmit, ButtonCancel, InputInGroup, SelectField } from '../../components/template/Form';
import RestService from "../../services/RestService";
import {Redirect} from "react-router-dom";
const Rest = new RestService();

const Messages = new MessageService();

class UfList extends BasePageList
{

    static defaultProps = {
        urlBase: 'uf/all',
        title: 'menu.uf.title',
        fields: [
            {
                label: "page.uf.fields.id",
                field: "id",
                width: "5%"
            },
            {
                label: 'page.uf.fields.nome',
                field: "nome",
                width: "20%"
            },
            {
                label: 'page.uf.fields.sigla',
                field: "sigla",
                width: "20%"
            }
        ]
    };

    render()
    {
        let input_fields = [{label: 'page.uf.fields.nome', field: "nome"}];
        let filter = <Filter fields={input_fields} onChange={this.handleChange} onSubmit={this.handleOnSubmitFilter}/>;
        return (
            <TableData filter={filter} onClickPage={ this.handleClickPage } title='page.uf.list.title'
                       fields={ this.props.fields } data={ this.state.itens } pagination={ this.state.pagination }
                       actions={ this.state.actions } addUrl='/uf/add' onEdit={ this.handleOnEditAction }
                       onDelete={ this.handleOnDeleteAction } onView={ this.handleOnViewAction }/>
        );
    }

}

/*----------------------------------------------------------------------------------------------------*/

class UfAdd extends BasePageForm
{
    static defaultProps = {
        urlBase: 'uf/add',
        title: Messages.getMessage('menu.uf.title')
    };

    render()
    {

        return (
            <FormPage title="page.uf.add.title">

                <FormRow>
                    <InputInGroup type="text" name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.uf.fields.nome' required="required" colsize="6"  />
                </FormRow>

                <FormRow>
                    <InputInGroup empty={ true } name="sigla" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.uf.fields.sigla' required="required" colsize="6"  />
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

class UfEdit extends BasePageForm
{

    constructor(props) {
        super(props);

        this.handleResponse = this.handleResponse.bind(this);
    }
    static defaultProps = {
        urlBase: 'uf/edit',
        title: Messages.getMessage('menu.uf.title')
    };

    componentDidMount() {
        if (this.props.location.state === undefined){
            this.setState(({error:true}));
            return;
        }
        let id = this.props.location.state.item_id;
        Rest.view( "uf/view/" + id, this.state).then(this.handleResponse);
    }

    handleResponse(data) {
        this.setState((
            data.data
        ))
    }

    async handleOnSubmit(e) {
        Rest.edit(this.props.urlBase + "/" + this.state.id, this.state).then(this.handleReceiveResponseRest)
    }

    render()
    {
        return (
            this.state.error ?
                (< Redirect to={"/"} state={{from: this.props.location}}/>):
            <FormPage title="page.uf.edit.title">

                <FormRow>
                    <InputInGroup type="text" name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.uf.fields.nome' required="required" colsize="6"  value={this.state.nome}/>
                </FormRow>
                <FormRow>
                    <InputInGroup empty={ true } name="sigla" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.uf.fields.sigla' required="required" colsize="6" value={this.state.ibge} />
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


class UfView extends BasePageForm
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
        urlBase: 'uf/view',
        title: Messages.getMessage('menu.uf.title')
    };

	componentDidMount() {
		if (this.props.location.state === undefined){
			this.setState(({error:true}));
			return;
		}
		let id = this.props.location.state.item_id;
		Rest.view( "uf/view/" + id, this.state).then(this.handleResponse);
	}

	handleResponse(data) {
		this.setState((
			data.data
		));
    }
    
    
    render()
    {
        let fields = [
            {label:"ID: ", value:this.state.id}, 
            {label:"Nome: ", value:this.state.nome},
            {label:"Sigla: ", value:this.state.sigla}
        ];
        return (
            this.state.error ?
            ( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
                (<BasicView title={"Estado " + this.state.nome} url={"#uf/edit?id=" + this.state.id}  onClickEdit={this.onClickEdit} fields={fields}/>)
        );
    }
}



export { UfList, UfAdd, UfView, UfEdit };