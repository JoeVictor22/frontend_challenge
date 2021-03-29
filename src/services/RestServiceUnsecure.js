import axios from "axios";
import { Properties } from "../config";
// rest usado para requisicoes sem autorizacao
class RestServiceUnsecure {

/*---- ------------------------------------------------------------------------------------------------*/
  axiosHandler(request) {
    return axios(request)
    .then(this._checkStatus)
    .catch((error) => {
	// in case of error, this is the data persisted to the client

      let res = {
        'error': true,
        'data': {
          'error': true,
          ...error?.response?.data
              }
         }
      return res;
    });
  }
/*----------------------------------------------------------------------------------------------------*/

  _checkStatus(response) {
	    if (response.status >= 200 && response.status < 300) {
		return response;
	    }else {
	      var error = new Error(response.statusText);
	      error.response = response;
	      
	      throw error;
		}
	  }
  /*----------------------------------------------------------------------------------------------------*/

  get(urlBase, param, header = null) {
    let request = {
      url: `${Properties.domain}/${urlBase}`,
      method: "GET",
      responseType: null,
      params: param,
      headers: { ...header },
    };
    return this.axiosHandler(request);
  }

  /*----------------------------------------------------------------------------------------------------*/

  post(urlBase, data, header = null) {
    let request = {
      url: `${Properties.domain}/${urlBase}`,
      method: "POST",
      responseType: null,
      data: data,
      headers: { ...header },
    };
    return this.axiosHandler(request);
  }



 

}
export default RestServiceUnsecure;
