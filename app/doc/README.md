# Roar.Network

**Evolutive and Flexible Creator Network**

Our goal is to redefine the creator economy with a flexible and evolutive user-owned content creator social network, with evolutive tools in line with the current trends of the creator economy and the internet of money.
We propose some new users interaction models, and hope a lot more get invented by the network users themselves.



## Problem

Current social network
 * Monopoly of centralized players
 * Censorship
 * Imposing policies
 * Monetization
 

## Solution

Here comes Roar.network.

 * Decentralized content indexing and storage
 * Pseudonymous profiles
 * Flexible, prgrammable content types
 * Flexible, programmable interactions

We provide the infrastructure and standardized interfaces for interaction and new modules to be built.

 
### Who [and why and how] will love Roar.Network?

Content creators and content consumers will love it. I personally would first look to have Palladium Mag switch to our solution and would sponsor it if they wanted to just to have Samo Burja and else be here, and have a "hosted on Roar" in the footer.

**Who are the content creators who would like our platform?**

 * bloggers who want a free, scaling solution without high fees later on
 * Newsletter bros who dont wanna pay $9/m upfront on ghost but feel the Substack 10% is a bit too much later on
 * youtube creators who want to connect with their audience in a better fashion than liking youtube comments, and get extra monetization
 * podcasters 

**Why will they like it?**
 * easy to use: use markdown editor to publish a story, it's transparently stored on IPFS and "/post IPFSlink" published as message on your feed
 * better monetization
 * new modules being developed by the community that are awesome and redefine the social network experience (tip, crowdfunding new content, ...)
 * connect with more users on the platform
 * create your blog/publication simply, we create a domain name for your blog


## Architecture

![image](/images/doc/architecture.png)

### Blockchain

The base layer of Roar.network is a blockchain based on the polygon SDK. This is a fork from the original Geth and runs a slightly modified EVM that will allow rollups in the future. It runs with the iBFT consensus to allow fast block creation and finality.

The 2 main smart contracts are the Message Container and the Profile Factory.

#### Message Container: RoarMessage

The Message Container is an ERC721 compatible contract that allows a profile to create new messages. 
```	
struct RoarMsg {
	bool isEditable;
	bool isPrivate;
	
	uint256 replyToId;
	
	string messageType;
	string message;
	
	string[] plugins;
	string[] interactions;
	uint256[] comments;
}
```
A message has a type and a content. The content is any string of text, and reference an externally stored file, for example it can be an IPFS link. 
By default, type is "tweet", currently implement types include "post", "newsletter". 
Those types give clues to the frontend on how to interpret the message. While for regular markdown content or IPFS link it's pretty obvious, it can be a an ID or a list of parameters. For example, for the `poll` messageType, a pollID is expected as message.

The interaction array lists the allowed interactions. The contract doesn't check because parsing strings and running through arrays is expensive, but any frontend should check allowed interactions. This means it isn't secure, and isn't meant to be, it is merely an indicator. If you tip a message that doesn't accept tip, nobody prevents you from parting with your money.

#### Profile Factory and Profiles

The profile factory spawns new profiles and references them in a `mapping ( string => Profile ) userProfiles` mapping. When registering on the network, a user creates a profile with the profile factory and this profile is mapped to a username.

Each profile is an ERC20 compatible contract. The profile coins (=creator stock) can be traded. Other functions include `receivePaymentAndShareDividends` which redistribute a share of a payment received by that profile to all shareholders.

The tokenomics of the creator stocks are discussed later.

Only profiles can create and own messages. This is done so that complex interactions can be developed and rely on a standard interface to function.

#### Interactions

Interactions can be developed by anyone. Interactions can be registered as a message interaction in the Message Container. 
A typical interaction is shown by the frontend and allows the user to execute an action related to a message or to a profile.

A simple interaction like tipping a message owner is shown below and is already implemented by Roar.Network.
More complex interactions are developed later on.

### Storage

The amount of data that can be stored onchain is in practice pretty low. For anything larger than a short message, the data has to be stored in a third party storage, whether decentralized (Swarm, Arweave, IPFS...) or not (Youtube, ...). In that case, the message saved is a link to the data.

The user can either share a link to an existing resource, for example by publishing a link to a Youtube video, or directly use some frontend functionality that will upload the content to its own server (for example with the IPFS protocol) and save the resulting link in the message.


### Middleware

The data on the blockchain layer is secure, however it's not efficiently queryable, indexed or visible in efficient ways. The middleware layer provides 3 main functions:

 * Explorer: the explorer allows to get easily query and visualize the transactions, content and relevant information at a low level
 * Search: the search engine reads all messages, retrieves external data potentiall


## Creating content

Some doc about creating new message types or interactions

### Interactions

Interactions are smart contract registered in the CloutMessage contract, and implementing arbitrary interaction logic. To be allowed, it should be listed in the message interaction list



#### Practical example: tips

For example, we create a tipping interaction. The logic is to create a **tip** smart contract, register it as **tip** plugin in CloutMessage, then add it to the messages interaction types upon creation (or later).

Registering it in the CloutMessage contract isn't mandatory, but it allows to keep a list of authorized interactions. For example, there may be some tweets that don't want to receive tips.

On the frontend side, when retrieving the message information, **tip** will appear in the list of interactions `string[] interactions`. The frontend is responsible for listing this interaction in the interaction list and providing the logic according to the **tip** module documentation.

The **tip** module implements a function to receive Eth through a payable function, record payment and forward the Eth to the message owner. The creator of the message also receives a percentage of the tips, set to be 1% by default. The tipping contract keeps a 0.1% fee (modifiable by governance). The remainder is sent to the owner profile through the `receivePaymentAndShareDividends` function, which will distribute a percentage of the tip to the dividend owners.

#### Practical example: Like button, Extended emoticons

The famous Like button could be implemented as a smart contract. It would keep track of who likes a tweet by associating a mapping to the message Id.
```
Struct Likes {
	mapping ( address => bool ) whoLikes;
}
mapping ( uint256 => Likes ) likes;
```

The logic is the same for more advanced emoticons like on Discord, `whoLikes` could be a mapping `(address => string)` where emoticons are saved as a list, e.g `[like,thumbup]`


## TODO

### Blockchain layer

* smart contracts
	* define standard Profile and Messages interfaces
	* create governance contract
	* change from accepting Eth as payment to accepting erc777 (goal is to have everything running with USD stablecoin)
* run polygon SDK test network
	* create access doc
	* 
	
### Middleware layer

* simple explorer
	* nodejs process
	* parse blocks store mongo
* query service
	* serve graphQL requests
	* serve complete messages including interactions and owner/creator information (mongo populate)
		* basic query service using react app, retrieves a list of user posts
	
### Front end

* React RoarNetwork
	* design + coherent CSS
* Documentation
* Blog system, publications
	* template over one user's posts + post selection (which ones appear in the list)
	* query list of posts by id 
	* new post: link to main site "new post", add post id to blog posts list
	* backend: add post by id, edit post list, edit template, edit main picture, provide card template, saved in local file if php?
	* or provide something for users with backend linked to our
* Markdown publisher
	* Simple markdown interface like substack: click on /post button, get nice editor interface, publish -> send message
		* images only form url from now, add unsplash ones
	* Save large markdown in IPFS
	* save image in IPFS
	* Publishes to roar (save on IPFS then publishes as /post IPFSlink )
