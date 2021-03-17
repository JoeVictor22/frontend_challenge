import { Component } from 'react';

class BasePage extends Component 
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			fieldErrors: [],
		}; 

		if(this.props.role == null) {
			this.props.onLoadUserRole();
		}
	}
}

export default BasePage;