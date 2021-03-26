import { Component } from 'react';

class BasePage extends Component 
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			fieldErrors: [],
			modal: false
		}; 

		if(this.props.role == null) {
			this.props.onLoadUserRole();
		}
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(){
		this.setState({modal:true});
	}
	closeModal(){
		this.setState({modal:false});
	}
}

export default BasePage;