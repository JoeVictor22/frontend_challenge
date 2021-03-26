import React, { Component } from 'react';
import MessageService from '../../services/MessageService';
import RestService from '../../services/RestService';
import Select from "react-select";
import Modal from "react-modal";
import cep from 'cep-promise'

import "./form.css"
const Messages = new MessageService();
const Rest = new RestService();

/*----------------------------------------------------------------------------------------------------*/

class InputInGroup extends Component {
	render() {
	  let classValue;
  
	  if (this.props.errors[this.props.name]) {
		classValue = "is-invalid form-control";
	  } else if (!this.props.class) {
		classValue = "form-control";
	  } else {
		classValue = "form-control " + this.props.class;
	  }
  
	  return (
		<div
		  className={
			"form-group " +
			(this.props.colsize ? "col-md-" + this.props.colsize : "")
		  }
		>
		  <label>
			{Messages.getMessage(this.props.label)}
			{this.props.required ? "*" : ""}
		  </label>
		  <input
			type={this.props.type}
			className={classValue}
			id={this.props.name}
			name={this.props.name}
			required={this.props.required}
			disabled={this.props.disabled}
			value={this.props.value}
			autoFocus={this.props.autofocus}
			onChange={this.props.onChange}
			maxLength={this.props.maxLength}
			checked={this.props.checked}
			onBlur={this.props.onChange}
			placeholder={this.props.placeholder}
		  />
		  <div className="invalid-feedback">
			{this.props.errors[this.props.name]
			  ? this.props.errors[this.props.name]
			  : ""}
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
class Select2Field extends Component {
	constructor(props) {
	  super(props);
  
	  this.state = {
		options: [],
		isLoading: false,
		selectedValue: null,
	  };
  
	  this.handleChange = this.handleChange.bind(this);
	  this.handleOnInputChange = this.handleOnInputChange.bind(this);
	  this.handleReceiveOptions = this.handleReceiveOptions.bind(this);
	  this.handleReceiveInitSelection = this.handleReceiveInitSelection.bind(
		this
	  );
	}
  
	static defaultProps = {
	  minLengthInput: 3,
	  value: null,
	  required: false,
	  placeholder: "layout.select-field.placeholder",
	};
  
	componentDidUpdate(prevProps, prevState, snapshot) {
	  if (prevProps.value !== this.props.value) {
		Rest.get(`${this.props.url_view}/${this.props.value}`, {}).then(
		  this.handleReceiveInitSelection
		);
	  }
	}
  
	componentDidMount() {
	  if (this.props.value) {
		Rest.get(`${this.props.url_view}/${this.props.value}`, {}).then(
		  this.handleReceiveInitSelection
		);
	  } else {
		Rest.get(this.props.url_list, this.props.urlParameters).then(
		  this.handleReceiveOptions
		);
	  }
	}
  
	handleChange(e) {
	  this.setState({
		selectedValue: e,
	  });
	  console.log(e);
	  console.log(this.state.options);
	  const event = {
		target: {
		  name: this.props.name,
		  value: e !== null ? e.value : null,
		  label: e !== null ? e.label : null,
		},
	  };
  
	  this.props.onChange(event);
	}
  
	handleOnInputChange(e) {
	  if (
		e.length >= this.props.minLengthInput ||
		(e.length === 0 && this.state.selectedValue === null)
	  ) {
		this.setState({
		  isLoading: true,
		  selectedValue: null,
		  value: null,
		});
  
		Rest.get(this.props.url_list, {
		  ...this.props.urlParameters,
		  [this.props.filterName]: e,
		}).then(this.handleReceiveOptions);
	  }
	}
  
	handleReceiveOptions(res) {
	  this.setState({
		isLoading: false,
	  });
  
	  if (!res.data.error) {
		let self = this;
		let options = res.data.itens.map((item) => {
		  let label = self.props.displayName
			.map((fld) => {
			  const reducer = (acc, cur) => acc[cur];
			  return fld.split(".").reduce(reducer, item);
			})
			.join(" - ");
  
		  return { label: label, value: item.id };
		});
  
		this.setState({
		  options: options,
		});
	  }
	}
  
	handleReceiveInitSelection(res) {
	  if (!res.data.error) {
		let label = this.props.displayName
		  .map((fld) => {
			const reducer = (acc, cur) => acc[cur];
			return fld.split(".").reduce(reducer, res.data);
		  })
		  .join(" - ");
  
		this.setState({
		  selectedValue: { value: res.data.id, label: label },
		});
	  }
	}
  
	render() {
	  return (
		<div
		  className={
			"form-group " +
			(this.props.colsize ? "col-md-" + this.props.colsize : "")
		  }
		>
		  <label>
			{Messages.getMessage(this.props.label)}
			{this.props.required ? "*" : ""}
		  </label>
		  <Select
			autoFocus={this.props.autofocus}
			options={this.state.options}
			onChange={this.handleChange}
			isLoading={this.state.isLoading}
			onInputChange={this.handleOnInputChange}
			isClearable={!this.props.required}
			value={this.state.selectedValue}
			placeholder={Messages.getMessage(this.props.placeholder)}
		  />
		  <div className="invalid-message">
			{this.props.errors[this.props.name]
			  ? this.props.errors[this.props.name]
			  : ""}
		  </div>
		</div>
	  );
	}
  }
  
/*----------------------------------------------------------------------------------------------------*/

/** Deve ser enviado o value ao componente para evitar erro de mudanca de controle */
class InputCpf extends Component {
	constructor(props) {
	  super(props);
	  this.handleMaskChange = this.handleMaskChange.bind(this);
	}
  
	handleMaskChange(e) {
	  var valor = e.target.value;
	  //001.716.503-02
	  if (valor.length < 15) {
		valor = valor
		  .replace(/\D/g, "")
		  .replace(/(\d{3})(\d)/, "$1.$2")
		  .replace(/(\d{3})(\d)/, "$1.$2")
		  .replace(/(\d{3})(\d{1,2})/, "$1-$2")
		  .replace(/(-\d{2})\d+?$/, "$1");
  
		e.target.value = valor;
		this.props.onChange(e);
	  } else if (valor === "") {
		this.props.onChange(e);
	  }
	}
	render() {
	  let classValue;
  
	  if (this.props.errors[this.props.name]) {
		classValue = "is-invalid form-control";
	  } else if (!this.props.class) {
		classValue = "form-control";
	  } else {
		classValue = "form-control " + this.props.class;
	  }
  
	  return (
		<div
		  className={
			"form-group " +
			(this.props.colsize ? "col-md-" + this.props.colsize : "")
		  }
		>
		  <label>
			{Messages.getMessage(this.props.label)}
			{this.props.required ? "*" : ""}
		  </label>
  
		  <input
			type={this.props.type}
			className={classValue}
			id={this.props.name}
			name={this.props.name}
			required={this.props.required}
			disabled={this.props.disabled}
			value={this.props.value || ""}
			autoFocus={this.props.autofocus}
			onChange={this.handleMaskChange}
			maxLength={this.props.maxLength}
			checked={this.props.checked}
			placeholder={this.props.placeholder || "000.000.000-00"}
		  />
		  <div className="invalid-feedback">
			{this.props.errors[this.props.name]
			  ? this.props.errors[this.props.name]
			  : ""}
		  </div>
		</div>
	  );
	}
  }
  
/*----------------------------------------------------------------------------------------------------*/

/** Deve ser enviado o value ao componente para evitar erro de mudanca de controle */
class InputPis extends Component {
	constructor(props) {
	  super(props);
	  this.handleMaskChange = this.handleMaskChange.bind(this);
	}
  
	handleMaskChange(e) {
	  var valor = e.target.value;
	  //207.26075.20-1
	  if (valor.length < 15) {
		valor = valor
		  .replace(/\D/g, "")                                      
		  .replace(/^(\d{3})(\d)/, "$1.$2")                        
		  .replace(/^(\d{3})\.(\d{5})(\d)/, "$1.$2.$3")            
		  .replace(/(\d{3})\.(\d{5})\.(\d{2})(\d)/, "$1.$2.$3-$4")

		e.target.value = valor;
		this.props.onChange(e);
	  } else if (valor === "") {
		this.props.onChange(e);
	  }
	}
	render() {
	  let classValue;
  
	  if (this.props.errors[this.props.name]) {
		classValue = "is-invalid form-control";
	  } else if (!this.props.class) {
		classValue = "form-control";
	  } else {
		classValue = "form-control " + this.props.class;
	  }
  
	  return (
		<div
		  className={
			"form-group " +
			(this.props.colsize ? "col-md-" + this.props.colsize : "")
		  }
		>
		  <label>
			{Messages.getMessage(this.props.label)}
			{this.props.required ? "*" : ""}
		  </label>
  
		  <input
			type={this.props.type}
			className={classValue}
			id={this.props.name}
			name={this.props.name}
			required={this.props.required}
			disabled={this.props.disabled}
			value={this.props.value || ""}
			autoFocus={this.props.autofocus}
			onChange={this.handleMaskChange}
			maxLength={this.props.maxLength}
			checked={this.props.checked}
			placeholder={this.props.placeholder || "000.00000.00-0"}
		  />
		  <div className="invalid-feedback">
			{this.props.errors[this.props.name]
			  ? this.props.errors[this.props.name]
			  : ""}
		  </div>
		</div>
	  );
	}
  }
  
/*----------------------------------------------------------------------------------------------------*/
/** Deve ser enviado o value ao componente para evitar erro de mudanca de controle */
class InputCep extends Component {
	constructor(props) {
	  super(props);
	  this.handleMaskChange = this.handleMaskChange.bind(this);
	}
  
	handleMaskChange(e) {
	  var valor = e.target.value;
	  //60730-235
	  if (valor.length < 10) {
		valor = valor.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
  
		e.target.value = valor;
		this.props.onChange(e);
		
		if (valor.length == 9){ 
			cep(valor,  { timeout: 5000, providers: ['viacep'] }).then((res) => {
				console.log(res);
				let e_street = {
					target: { name: this.props.street_name || "street", value: res.street}
				};
				this.props.onChange(e_street);
				let e_neig = {
					target: { name: this.props.neighborhood_name || "neighborhood", value: res.neighborhood}
				};
				this.props.onChange(e_neig);
			}).catch(console.log)

		}

	  } else if (valor === "") {
		this.props.onChange(e);
	  }
	}

	handleCepConsult(){
		
	}
	render() {
	  let classValue;
  
	  if (this.props.errors[this.props.name]) {
		classValue = "is-invalid form-control";
	  } else if (!this.props.class) {
		classValue = "form-control";
	  } else {
		classValue = "form-control " + this.props.class;
	  }
  
	  return (
		<div
		  className={
			"form-group " +
			(this.props.colsize ? "col-md-" + this.props.colsize : "")
		  }
		>
		  <label>
			{Messages.getMessage(this.props.label)}
			{this.props.required ? "*" : ""}
		  </label>
  
		  <input
			type={this.props.type}
			className={classValue}
			id={this.props.name}
			name={this.props.name}
			required={this.props.required}
			disabled={this.props.disabled}
			value={this.props.value || ""}
			autoFocus={this.props.autofocus}
			onChange={this.handleMaskChange}
			maxLength={this.props.maxLength}
			checked={this.props.checked}
			placeholder={this.props.placeholder || "00000-000"}
		  />
		  <div className="invalid-feedback">
			{this.props.errors[this.props.name]
			  ? this.props.errors[this.props.name]
			  : ""}
		  </div>
		</div>
	  );
	}
  }
  
/*----------------------------------------------------------------------------------------------------*/
const modalStyle = {
	content: {
	  top: "50%",
	  left: "50%",
	  right: "auto",
	  bottom: "auto",
	  marginRight: "-50%",
	  transform: "translate(-50%, -50%)",
	  background: "rgba(0,0,0,0)",
	  border: "0px",
	},
  };

class SimpleModal extends Component {
	render() {
	  return (
		<Modal
		  ariaHideApp={false}
		  isOpen={this.props.isOpen}
		  onRequestClose={this.props.closeModal}
		  style={modalStyle}
		  contentLabel={"Modal " + this.props.name}
		>
		  <div className="modal_div">{this.props.children}</div>
		</Modal>
	  );
	}
  }
  
  /*----------------------------------------------------------------------------------------------------*/
  
export { InputInGroup, RememberMeInGroup, ButtonSubmit, ButtonCancel, SelectField, Select2Field, InputCpf, InputPis, InputCep, SimpleModal};