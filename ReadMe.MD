# WebSocket-Starter: written with nodeJS

**Necessary npm packages are:**
fs node-fetch and ws

**To execute in local diriectory:**
1. update the credentials.js file with your websocket url, clientid and secret, working directory and bbox. 
2. Run the following command from the local directory:

```
$ node websocket.js [Predix-Zone-ID] [eventType] [secondEventType]
$ node websocket.js HAMILTON-IE-TRAFFIC TFEVT 
```

Note: [secondEventType] is optional and only functional for the Parking API and Environmental API

*Sample commands to execute:*
```
$ node websocket.js Montreal-IE-TRAFFIC TFEVT 
```
```
$ node websocket.js Montreal-IE-PARKING PKIN PKOUT
```

**Output:**
- All logs will be published to a file made up of the predix zone id and eventType(s) that ends in logs.txt
- All data will be published to a file made up of the predix zone id and eventType(s) that ends in data.txt
