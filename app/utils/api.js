class API {
	/**
   * Create authenticated headers for requests // currentyl no auth
   * @return array of headers
   */
	createHeaders() {
		// all requests for now are JSON
		const header = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		};
		// if (this.sessionToken) header['Authorization'] = 'Bearer ' + this.sessionToken;
		return header;
	}

	async sendRequest(requestUrl, method, params) {
		const status = 'SUCCESS';
		const statusCode = 200;

		const result = await fetch(requestUrl, {
			method,
			headers: this.createHeaders(),
			body: JSON.stringify(params),
		})
			.then(async response => {
				const result = await response.json();
				result.statusCode = response.status;
				return result;
			})
			.catch(error => {
				console.error(requestUrl, error);
				// in case of error, return 503, could be network unavailable
				return { statusCode: '503' };
			});
		return result;
	}

	// Helpers
	async getRequest(requestUrl, params) {
		return await this.sendRequest(requestUrl, 'GET', params);
	}

	async postRequest(requestUrl, params) {
		return await this.sendRequest(requestUrl, 'POST', params);
	}

  /*
   * @dev Returns fully populated message from API, no additional info should be needed for display
   */
  getMessage = async index => {
  	const message = await this.getRequest(`/api/getMessage/${index}`);
  	return message;
  };

  /*
   * @dev Returns highest message ID
   */
  async getHighestMessage() {
  	const total = await this.getRequest('/api/');
  	console.log('Total network messages', total);
  	return total.messagesHeight;
  }

  /**
   * @dev Fetch a profile information
   */
  getProfile = async username => {
  	const profile = await this.getRequest(`/api/getProfile/${username}`);
  	// let messages = await this.messagesContract.methods.getProfileMessages(profileAddress).call();
  	return profile;
  };

  /**
   * @dev Fetch a profile information
   */
  login = async (userAddress, userSignature, randomString) => {
  	if (!userAddress) {
  		const profile = await this.getRequest('/login');
  		return profile;
  	}

  	const profile = await this.postRequest('/login', {
  		userAddress,
  		userSignature,
  		randomString,
  	});
  	return profile;
  };

  /**
   * @dev Ask server to logout (only destroys server session)
   */
  logout = async () => {
  	const profile = await this.getRequest('/logout');
  	return profile;
  };

  /**
   * @dev Ask server for airdrop
   */
  getAirdrop = async () => {
  	const airdrop = await this.getRequest('/api/airdrop');
  	console.log(airdrop);
  	return airdrop;
  };
}

// Export an instantiated class, no need to reinstantiate every time it's called somewhere
const api = new API();
export default api;
