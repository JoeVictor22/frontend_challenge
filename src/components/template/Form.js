import React, { Component } from 'react';
import MessageService from '../../services/MessageService';
import RestService from '../../services/RestService';
const Messages = new MessageService();
const Rest = new RestService();

/*----------------------------------------------------------------------------------------------------*/

class InputInGroup extends Component 
{		
	render() 
	{
		let classValue;
		
		if (this.props.errors[this.props.name]) {
			classValue = "is-invalid form-control";
		} 
		else {
			classValue = "form-control";
		}
		
		return (
			<div className= {"form-group col " + (this.props.colsize ? "col-md-" + this.props.colsize : "")  }>
				<label>{ Messages.getMessage(this.props.label) }</label>
				<input type={ this.props.type } className={ classValue } id={ this.props.name }  name={ this.props.name }
					required={ this.props.required } disabled={this.props.disabled} value={this.props.value} autoFocus={ this.props.autofocus } onChange={ this.props.onChange } />
				<div className="invalid-feedback">
					{ this.props.errors[this.props.name] ? this.props.errors[this.props.name] : '' }
				</div>
            </div>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class RememberMeInGroup extends Component 
{	
	render() 
	{	
		return (
			<div className="form-group col">
				<div className="checkbox">
					<label>
						<input type="checkbox" value="remember-me" /> { Messages.getMessage(this.props.text) }
					</label>
				</div>
			</div>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class ButtonSubmit extends Component 
{	
	render() 
	{
		return (
			<input className='btn btn-primary button-form' value={ Messages.getMessage(this.props.text) } type="submit" 
				onClick={ this.props.onClick } />
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class ButtonCancel extends Component 
{	
	render() 
	{
		return (
			<input className='btn btn-danger button-form' value={ Messages.getMessage(this.props.text) } type="submit" 
				onClick={ this.props.onClick } />
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/

class SelectField extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {

			options: this.props.options ? this.props.options: []
		};

		this.handleReceiveOption = this.handleReceiveOption.bind(this);
		this._isMounted = false;
	}

	async handleReceiveOption(res)
	{
		if (res.status === 200) {
			this._isMounted && this.setState({
				options: res.data.itens
			});
		}
	}

	componentDidMount()
	{
		this._isMounted = true;
		console.log(this.props.url);
		this._isMounted && Rest.get(this.props.url, this.props.urlParameters).then(this.handleReceiveOption);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	concatenarValues(data) {
		let keys = Object.keys(data);
		
		let value = "";
		keys.forEach( function (key) {
			value += key + ":"+ data[key] + "/ "
		});
		return value;
	}
	render()
	{
		let classValue;
		let key;
		if(JSON.stringify(this.state.urlParameters)!== JSON.stringify(this.props.urlParameters)){
			Rest.get(this.props.url, this.props.urlParameters).then(this.handleReceiveOption);
			this.setState(({urlParameters: this.props.urlParameters}))
		}
		if (this.props.errors[this.props.name]) {
			classValue = "is-invalid form-control";
		}
		else {
			classValue = "form-control";
		}

		key=1;
		console.log(this.state.options);
		const options = this.state.options.map((data) =>
			<option key={key++} value={data[this.props.value_name?this.props.value_name:this.props.name]}>{ data.nome ? data.nome: this.concatenarValues(data) }</option>
		);


		return (
			<div className= { "form-group col " + (this.props.colsize ? "col-md-" + this.props.colsize : "") }>
				<label>{ Messages.getMessage(this.props.label) }</label>
				<select className={ classValue } id={ this.props.name }  name={ this.props.name }
						required={ this.props.required } value={this.props.value} autoFocus={ this.props.autofocus } onChange={ this.props.onChange }>
					{ this.props.empty === true ? <option value=""/> : '' }
					{ options }
				</select>

				<div className="invalid-feedback">
					{ this.props.errors[this.props.name] ? this.props.errors[this.props.name] : '' }
				</div>
			</div>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/
class SelectRegion extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			options: []
		};

		this.handleReceiveOption = this.handleReceiveOption.bind(this);
		this._isMounted = false;
	}

	async handleReceiveOption(res)
	{
		this._isMounted && this.setState({
			options: res.data
		});
	}

	componentDidMount()
	{
		this._isMounted = true;
		this._isMounted && Rest.get(this.props.url, this.props.urlParameters).then(this.handleReceiveOption);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render()
	{
		return (
			<div className= { "form-group col " + (this.props.colsize ? "col-md-" + this.props.colsize : "") }>
				<label>{ Messages.getMessage(this.props.label) }</label>
				<select className="form-control" id={ this.props.name }  name={ this.props.name }
						required={ this.props.required } value={this.props.value} autoFocus={ this.props.autofocus } onChange={ this.props.onChange }>
					<option value=""/>
					<option value="NE">Centro Oeste - CO</option>
					<option value="NE">Nordeste - NE</option>
					<option value="NE">Norte - N</option>
					<option value="NE">Sudeste - SE</option>
					<option value="NE">Sul - S</option>
				</select>

				<div className="invalid-feedback">
					{ this.props.errors[this.props.name] ? this.props.errors[this.props.name] : '' }
				</div>
			</div>
		);
	}
}

/*----------------------------------------------------------------------------------------------------*/


export { InputInGroup, RememberMeInGroup, ButtonSubmit, ButtonCancel, SelectField, SelectRegion};