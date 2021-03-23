import RestService from '../../services/RestService';
import BasePage from './BasePage';
import {AlertifyError, AlertifySuccess} from "../../services/AlertifyService";

const Rest = new RestService();

class BasePageList extends BasePage
{
	_isMounted = false;

	constructor(props) 
	{
		super(props);
		
		this.state = {
			itens: [],
			pagination: {
				loaded: false,

				current: 0,
				itens_count: 0,
				itens_per_page: 0,
				next: null,
				pages_count: 0,
				prev: null
			},
			...this.state
		};

		this.fetchList = this.fetchList.bind(this);
		this.handleReceiveDataPage = this.handleReceiveDataPage.bind(this);
		this.handleClickPage = this.handleClickPage.bind(this);
		this.handleOnEditAction = this.handleOnEditAction.bind(this);
		this.actionView = this.actionView.bind(this);
		this.actionDelete = this.actionDelete.bind(this);
		this.actionEdit = this.actionEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleOnSubmitFilter = this.handleOnSubmitFilter.bind(this);
	}

	fetchList(parameters) {	
		return Rest.get(this.props.urlBase, parameters);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleReceiveDataPage(res)
	{
		if (this._isMounted)
		console.log("res")
		{
			if(res?.data.pagination){
				let pagination = {
					loaded: true,
					current: res.data.pagination.current,
					itens_count: res.data.pagination.itens_count,
					itens_per_page: res.data.pagination.itens_per_page,
					next: res.data.pagination.next,
					pages_count: res.data.pagination.pages_count,
					prev: res.data.pagination.prev
				};
				
				this.setState({
					itens: [...res.data.itens],
					pagination: pagination
				});
			}
		}
	}

	handleOnEditAction(e) {
        debugger;
    }

	handleChange(e)
	{
		console.log(e.target.value);
		this.setState({[e.target.name]: e.target.value})
	}

	handleOnSubmitFilter(e) {
		console.log(this.state);
		let chaves = Object.keys(this.state);
		let parameters = {};
		for (let i = 0; i < chaves.length; i++) {
			if (this.state[chaves[i]] !== "") {
				parameters[chaves[i]] = this.state[chaves[i]];
			}
		}
		this.fetchList(parameters).then(this.handleReceiveDataPage);
	}

	handleClickPage(page)
	{
		this.fetchList({
			page: page
		}).then(this.handleReceiveDataPage);

	}

	componentDidMount()
	{
		this._isMounted = true;

		this.fetchList().then(this.handleReceiveDataPage);
		this.setState(({
			actions: [
				{
					label: 'action.edit',
					field: "edit",
					handle: this.actionEdit
				},
				{
					label: 'action.delete',
					field: "delete",
					handle: this.actionDelete
				},
				{
					label: 'action.view',
					field: "view",
					handle: this.actionView
				}
			]
		}));
	}

	actionView(event, id) {
		let url = "/" + this.props.urlBase.split("/")[0] + "/view";
		this.props.history.push({
			pathname: url,
			state: {item_id: id}
		});
	}

	actionDelete(event, id) {
		let tr = event.currentTarget.parentElement.parentElement;
		let url = this.props.urlBase.split("/")[0] + "/delete/";
		Rest.delete(url + id, {}).then(function (resposta) {
			if (resposta.status === 200) {
				if (!resposta.data.error) {
					AlertifySuccess([{message: resposta.data.message}]);
					tr.remove();
				} else {
					AlertifyError([{message: resposta.data.message}]);
				}
			}
		}).catch(function (error) {
			AlertifyError([error]);
		});
	}

	actionEdit(event, id) {
		let url = "/" + this.props.urlBase.split("/")[0] + "/edit";
		this.props.history.push({
			pathname: url,
			state: {item_id: id}
		});
	}

}

export default BasePageList;