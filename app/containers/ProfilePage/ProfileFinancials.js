import React from 'react';
import CloutContext from '../../cloutContext';
import DefaultUser from '../../images/defaultuser.png';

class ProfileFinancials extends React.Component {
	static contextType = CloutContext;
	
	render (){
		const sharePrice = parseFloat(
		  this.props.profile.tokenValue
				? this.props.profile.tokenValue / this.props.profile.tokenSupply
				: 0,
		).toFixed(2);
		const peratio =
		  this.props.profile.lifetimeDividends > 0 &&
		  this.props.profile.tokenValue / this.props.profile.lifetimeDividends;
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
                Total Shares:
					<img
						src={this.props.profile.profilePicture || DefaultUser}
						style={{
							width: 20,
							height: 20,
							marginLeft: 5,
							marginRight: 5,
						}}
					/>
					<span style={{ fontSize: 18, fontWeight: 'bold' }}>
						{parseFloat(
							(this.props.profile.tokenSupply || 0) / 10 ** 18,
						).toFixed(2)}{' '}
					</span>
				</span>
				<span>
                Share Price:{' '}
					<span style={{ fontSize: 18, fontWeight: 'bold' }}>
                  $ {sharePrice}{' '}
					</span>
				</span>
				<span>
                Dividends distributed:{' '}
					<span style={{ fontSize: 18, fontWeight: 'bold' }}>
                  ${' '}
						{parseFloat(
							this.props.profile.lifetimeDividends || 0,
						).toFixed(2)}
					</span>
				</span>
				<span>
                PE ratio:{' '}
					<span style={{ fontSize: 18, fontWeight: 'bold' }}>
						{peratio || <span style={{ fontSize: 25 }}>&#8734;</span>}
					</span>
				</span>
			</div>
		)
	}
}


export default ProfileFinancials;