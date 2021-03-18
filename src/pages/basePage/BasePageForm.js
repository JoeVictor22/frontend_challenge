import BasePage from './BasePage';
import RestService from '../../services/RestService';
import { AlertifySuccess, AlertifyError } from '../../services/AlertifyService';

const Rest = new RestService();

class BasePageForm extends BasePage
{
	constructor(props)
	{
		super(props);
		
		if(this.props.role == null) {
			this.props.onLoadUserRole();
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleReceiveResponseRest = this.handleReceiveResponseRest.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
		this.handleOnSubmitEdit = this.handleOnSubmitEdit.bind(this);
		this.handleResponse = this.handleResponse.bind(this);
		this.onClickEdit = this.onClickEdit.bind(this);
	}

	handleChange(e)
	{
        this.setState({
                [e.target.name]: e.target.value,
                fieldErrors: []
            }
        )
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

    	} else {
            AlertifySuccess([{message: res.data.message}]);
            this.props.history.push('/' + this.props.urlBase.split('/')[0] + '/list');
        }
    }

    async handleOnSubmit(e) {
		console.log("submit", this.state)
    	Rest.post(this.props.urlBase, this.state).then(this.handleReceiveResponseRest);
    }
	async handleOnSubmitEdit(e) {
		console.log("submit edit", this.state)
		Rest.put(this.props.urlBase + "/" + this.state.id, this.state).then(
			this.handleReceiveResponseRest
		);
	}
	handleResponse(data) {
		this.setState((
			data.data
		));
	}
	
    handleCancel(e) {
        this.props.history.push("/" + this.props.urlBase.split('/')[0] + '/list');
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
}

export default BasePageForm;