import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloutContext from '../../cloutContext';
import DefaultUser from '../../images/defaultuser.png';

class ProfileFinancials extends React.Component {
	static contextType = CloutContext;

	state = {
		buyOrSell: 'buy',
		amount: 0,
	};

	
  setDirection = buyOrSell => {
  	this.setState({ buyOrSell });
  };

  updateAmount = event => {
  	this.setState({ amount: event.target.value });
  };

  buySellTokens = async () => {
  	// CHeck if balance enough
  	let amountBought;
  	if (this.state.buyOrSell == 'buy') {
  		const amountBought = await this.context.wallet.buyTokens(this.state.amount, this.props.profile.profileAddress);
  	} else {
  		const valueSold = await this.context.wallet.sellTokens(this.state.amount, this.props.profile.profileAddress);
  	}
  };
	
	
	
	
  render (){
  	let bal = `$ ${this.context.wallet.ethBalance / 10**18}`;
  	if ( this.state.buyOrSell == 'sell' ) bal = ` ${this.context.wallet.balance / 10**18}`;
		
  	return (
  		<div style={{ display: 'flex', flexDirection: 'column' }}>
  			<div
  				style={{
  					display: 'flex',
  					flexDirection: 'row',
  					marginBottom: 10,
  					justifyContent: 'space-between',
  				}}
  			>
  				<Button
  					onClick={() => {
  						this.setDirection('buy');
  					}}
  					style={{
  						backgroundColor:
                      this.state.buyOrSell == 'buy'
                      	? 'rgb(14, 203, 129)'
                      	: 'rgba(230, 232, 234, 0.6)',
  						color: this.state.buyOrSell == 'buy' ? 'white' : 'grey',
  						display: 'block',
  						padding: '5px 25px 5px 25px',
  						borderRadius: 5,
  					}}
  				>
                  Buy
  				</Button>
  				<Button
  					onClick={() => {
  						this.setDirection('sell');
  					}}
  					style={{
  						backgroundColor:
                      this.state.buyOrSell == 'sell'
                      	? 'rgb(248, 73, 96)'
                      	: 'rgba(230, 232, 234, 0.6)',
  						color: this.state.buyOrSell == 'sell' ? 'white' : 'grey',
  						display: 'block',
  						padding: '5px 25px 5px 25px',
  						borderRadius: 5,
  						marginLeft: 20,
  					}}
  				>
                  Sell
  				</Button>
  			</div>
  			<div
  				style={{
  					display: 'flex',
  					flexDirection: 'row',
  					alignItems: 'center',
  					marginBottom: 10,
  				}}
  			>
  				<TextField
  					placeholder="Amount"
				  variant="outlined" 
  					style={{ marginBottom: 0 }}
  					onChange={this.updateAmount}
  				/>
  				{this.state.buyOrSell == 'buy' ? (
  					<span style={{ marginLeft: -20 }}>$</span>
  				) : (
  					<img
  						src={this.props.profile.profilePicture || DefaultUser}
  						style={{ width: 20, height: 20, marginLeft: -30 }}
  					/>
  				)}
  			</div>
  			<span>Avail: {bal}</span>
  			<Button variant="outlined" onClick={this.buySellTokens}>
  				{this.state.buyOrSell}
  			</Button>
  		</div>
  	)
  }
}


export default ProfileFinancials;