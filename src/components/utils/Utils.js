
/*----------------------------------------------------------------------------------------------------*/

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
};

/*----------------------------------------------------------------------------------------------------*/

const formatString = (format, parameters) => 
{
	let formattedString = format;

	for (let i = 0; i < parameters.length; i++) {
		formattedString = formattedString.replace("{"+ i +"}", parameters[i]);
	}

	return formattedString;
};

/*----------------------------------------------------------------------------------------------------*/

const Months = [{value:1, nome:"Janeiro"}, {value:2, nome:"Fevereiro"}, {value:3, nome:"Março"}, {value:4, nome:"Abril"},
	{value:5, nome:"Maio"}, {value:6, nome:"Junho"}, {value:7, nome:"Julho"}, {value:8, nome:"Agosto"},
	{value:9, nome:"Setembro"}, {value:10, nome:"Outubro"}, {value:11, nome:"Novembro"}, {value:12, nome:"Dezembro"}];

/*----------------------------------------------------------------------------------------------------*/

const getMonth = (value) =>
{
	for (let i = 0; i < 12; i++) {
		if (Months[i]["value"] === value) {
			return Months[i]["nome"];
		}
	}
};


export { sleep, formatString , Months, getMonth}