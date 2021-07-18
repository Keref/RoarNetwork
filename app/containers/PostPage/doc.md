# Roar.Network

**Evolutive and Flexible Creator Network**

Our goal is to redefine the creator economy with a flexible and evolutive user-owned content creator social network, with evolutive tools in line with the current trends of the creator economy and the internet of money.
We propose some new users interaction models, and hope a lot more get invented by the network users themselves.



## Creating content

Some doc about creating new message types or interactions

### Interactions

Interactions are smart contract registered in the CloutMessage contract, and implementing arbitrary interaction logic. To be allowed, it should be listed in the message interaction list

For example, we create a tipping interaction. The logic is to create a 'tip' smart contract, register it as 'tip' plugin in CloutMessage, then add it to the messages interaction types upon creation (or later).

On the frontend side, when retrieving the message information, 'tip' will appear in the list of interactions `string[] interactions`. The frontend is responsible for listing this interaction in the interaction list and providing the logic according to the 'tip' module documentation.

The 'tip' module implements a function to receive Eth through a payable function, record payment and forward the Eth to the message owner. The creator of the message also receives a percentage of the tips, although it is set to be 0% by default. The tipping contract keeps a 0.1% fee (modifiable by governance). The remainder is sent to the owner profile through the `payWithDividends` function, which will give a percentage of the tip to the dividend owners.