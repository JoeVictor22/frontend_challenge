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

class CidadeList extends BasePageList
{

    static defaultProps = {
        urlBase: 'cidade/all',
        title: 'menu.cidade.title',
        fields: [
            {
                label: "page.cidade.fields.id",
                field: "id",
                width: "5%"
            },
            {
                label: 'page.cidade.fields.nome',
                field: "nome",
                width: "20%"
            },
            {
                label: 'page.cidade.fields.ibge',
                field: "ibge",
                width: "10%"
            }
        ]
    };

    render()
    {
        let input_fields = [{label: 'page.cidade.fields.nome', field: "nome"}];
        let filter = <Filter fields={input_fields} onChange={this.handleChange} onSubmit={this.handleOnSubmitFilter}/>;
        return (
            <TableData filter={filter} onClickPage={ this.handleClickPage } title='page.cidade.list.title'
                       fields={ this.props.fields } data={ this.state.itens } pagination={ this.state.pagination }
                       actions={ this.state.actions } addUrl='/cidade/add' onEdit={ this.handleOnEditAction }
                       onDelete={ this.handleOnDeleteAction } onView={ this.handleOnViewAction }/>
        );
    }

}

/*----------------------------------------------------------------------------------------------------*/

class CidadeAdd extends BasePageForm
{
    static defaultProps = {
        urlBase: 'cidade/add',
        title: Messages.getMessage('menu.cidade.title')
    };

    render()
    {

        return (
            <FormPage title="page.cidade.add.title">

                <FormRow>
                    <InputInGroup type="text" name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.cidade.fields.nome' required="required" colsize="6"  />
                </FormRow>

                <FormRow>
                    <InputInGroup empty={ true } name="ibge" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.cidade.fields.ibge' required="required" colsize="6"  />
                </FormRow>


                <FormRow>
                    <SelectField empty={ true } name="uf_id" value_name="id" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                 label='page.cidade.fields.uf_id' required="required" colsize="6" url="uf/all" />
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

class CidadeEdit extends BasePageForm
{

    constructor(props) {
        super(props);

        this.handleResponse = this.handleResponse.bind(this);
    }
    static defaultProps = {
        urlBase: 'cidade/edit',
        title: Messages.getMessage('menu.cidade.title')
    };

    componentDidMount() {
        if (this.props.location.state === undefined){
            this.setState(({error:true}));
            return;
        }
        let id = this.props.location.state.item_id;
        Rest.view( "cidade/view/" + id, this.state).then(this.handleResponse);
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
            <FormPage title="page.cidade.edit.title">
                <FormRow>
                    <InputInGroup type="text" name="nome" errors={ this.state.fieldErrors } enabled="False" onChange={ this.handleChange }
                                  label='page.cidade.fields.id' disabled={true} required="required" colsize="2" value={this.state.id}  />
                </FormRow>
                <FormRow>
                    <InputInGroup type="text" name="nome" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.cidade.fields.nome' required="required" colsize="6"  value={this.state.nome}/>
                </FormRow>
                <FormRow>
                    <InputInGroup empty={ true } name="ibge" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                  label='page.cidade.fields.ibge' required="required" colsize="6" value={this.state.ibge} />
                </FormRow>
                <FormRow>
                    <SelectField empty={ true } name="uf_id" value_name="id" errors={ this.state.fieldErrors }  onChange={ this.handleChange }
                                 label='page.cidade.fields.uf_id' required="required" colsize="6" url="uf/all" value={this.state.uf_id}/>
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


class CidadeView extends BasePageForm
{

    constructor(props) {
        super(props);

        this.handleResponse = this.handleResponse.bind(this);
        this.setUF = this.setUF.bind(this);
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
        urlBase: 'cidade/view',
        title: Messages.getMessage('menu.cidade.title')
    };

    componentDidMount() {
        if (this.props.location.state === undefined){
            this.setState(({error:true}));
            return;
        }
        let id = this.props.location.state.item_id;
        Rest.view( "cidade/view/" + id, this.state).then(this.handleResponse);
    }

    handleResponse(data) {
        this.setState((
            data.data
        ), () => {
            Rest.view( "uf/view/" + this.state.uf_id, this.state).then(this.setUF);
        });
    }

    setUF(data) {

        this.setState((
            {"sigla": data.data.sigla}
        ));
    }

    render()
    {
        let fields = [{label:"IBGE: ", value:this.state.ibge}, {label:"UF: ", value:this.state.sigla}];
        return (
            this.state.error ?
            ( <Redirect to={{ pathname: "/login", state: { from: this.props.location } }}/> ) :
                (<BasicView title={"Cidade " + this.state.nome} url={"#cidade/edit?id=" + this.state.id}  onClickEdit={this.onClickEdit} fields={fields}/>)
        );
    }
}



export { CidadeList, CidadeAdd, CidadeEdit, CidadeView };