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

			} 
			AlertifyError(res.data.form);

    	} else {
            AlertifySuccess([{message: res.data.message}]);
            this.props.history.push('/' + this.props.urlBase.split('/')[0] + '/list');
        }
    }

    async handleOnSubmit(e) {
    	Rest.post(this.props.urlBase, this.state).then(this.handleReceiveResponseRest);
    }

    handleCancel(e) {
        this.props.history.push("/" + this.props.urlBase.split('/')[0] + '/list');
    }
}

export default BasePageForm;