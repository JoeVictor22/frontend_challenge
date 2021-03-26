import React, { Component } from 'react';
import MessageService from '../../services/MessageService';
import Select from "react-select";
import "./form.css"
import RestServiceUnsecure from '../../services/RestServiceUnsecure';
const Messages = new MessageService();
const Rest = new RestServiceUnsecure();

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
  
  export {Select2Field};