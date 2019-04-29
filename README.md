# nodeGSNRelay
A node based implementation of Gas Stations Network relay server


To run: 

start Ganache-cli

ganache-cli --deterministic

delete built folder (truffle gets hung up sometimes) 

'truffle depoloy --network development'

'nodemon relay.js'

To do: 

Implement all Relayhub functions inside RelayHub Class

Getters + Setters

Add Chalk

Add Spinner

Implement actual relaying of transaction

Implement watch-dog slashing

Startup script which deploys ganache + contracts

Take private keys out of code (current are default ganache test keys).

Add loading by hardware wallet. 

Add Batch feature

Add WebSockets

Implement GraphQL

Add Authentication via Oath, storage of users encrypted keypairs 

Add ethereum data feed via api + Websocket. 

Add Statechannel for data feed that allows DApp to prove data it receives is correct. 

Add ability to connect to multiple (random) providers via websocket and pole data from all to make assumptions about network. 
