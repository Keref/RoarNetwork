
class API {
	
	/**
	 * Create authenticated headers for requests // currentyl no auth
	 * @return array of headers
	 */
	createHeaders () {
		//all requests for now are JSON
		var header = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
		//if (this.sessionToken) header['Authorization'] = 'Bearer ' + this.sessionToken;
		return header;
	}
	
	
	
	async sendRequest (requestUrl, method, params){
		var status = 'SUCCESS';
		var statusCode = 200;
		
		var result = await fetch(requestUrl, {
				method: method,
				headers: this.createHeaders(),
				body: JSON.stringify(params),
			})
			.then( async (response) => {
				var result = await response.json();
				result.statusCode = response.status
				return result
			})
			.catch( (error) => {
				console.error(requestUrl, error);
				//in case of error, return 503, could be network unavailable
				return  { statusCode: '503' }
			});
		return result;
	}
	//Helpers
	async getRequest(requestUrl, params){ return await this.sendRequest(requestUrl, 'GET', params); }
	async postRequest(requestUrl, params){ return await this.sendRequest(requestUrl, 'POST', params); }
	
	
	
	/*
	 * @dev Returns fully populated message from API, no additional info should be needed for display
	 */
	getMessage = async (index) => {
		let message = await this.getRequest('/api/getMessage/'+index)
		return message;
	}

	/*
	 * @dev Returns highest message ID
	 */
	async getHighestMessage () {
		var total = await this.getRequest('/api/')
		console.log("Total network messages", total)
		return total.messagesHeight;
	}
	
	
	/**
	 * @dev Fetch a profile information 
	 */
	getProfile = async (handle) => {
		let profile = await this.getRequest('/api/getProfile/joe')
		//let messages = await this.messagesContract.methods.getProfileMessages(profileAddress).call();
		return profile;
	}

	
	

}


//Export an instantiated class, no need to reinstantiate every time it's called somewhere
var api = new API();
export default api;

