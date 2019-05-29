const credentials = require("./credentials.json")
const fetch = require('node-fetch')
const fs = require("fs")
const WebSocket = require('ws')
const btoa = str => new Buffer.from(str).toString('base64')

let inputEvent 
let inputZone, namePart1, namePart2, tempFirstEvent
let secondInputEvent = undefined
let workingDir=credentials.workingDir
let wsURL = credentials.wsURL
let clientIDclientSecret = credentials.developer
let bboxInput = credentials.bbox

process.argv.forEach((val, index) => {
  if (index == 2) {
    inputZone = val
    namePart1 = val
  } else if (index == 3){
    inputEvent = [val]
    tempFirstEvent = val
  } else if (index == 4) {
    secondInputEvent = val
  }
});

if (secondInputEvent != undefined) {
  inputEvent = [inputEvent,secondInputEvent]
  namePart2 = tempFirstEvent+'-'+secondInputEvent
} else {
  namePart2 = inputEvent
}

let logFile = workingDir+'/'+namePart1+'_'+namePart2+'_logs.txt'
let outputFile = workingDir+'/'+namePart1+'_'+namePart2+'_data.txt'
console.log('Opening WebSocket for events: '+inputEvent+' using Predix Zone Id: '+inputZone)
console.log(logFile)
console.log(outputFile)
// -----------------------------------------------------------------------------------------------------

async function listen() {
  // getting the token
  let result = fetch('https://auth.aa.cityiq.io/oauth/token?grant_type=client_credentials', 
                {headers:{authorization: 'Basic '+btoa(clientIDclientSecret)}}).then(res => res.json())
  let token = (await result).access_token
  fs.appendFile(logFile,'\n\nTOKEN: '+token,function(err){if (err) throw err;}) 
  // establishinig the connection
  let ws = new WebSocket(wsURL, {headers: {authorization: 'Bearer '+token, 'predix-zone-id': inputZone }})
  ws.on('open', function open() {
    var date = new Date()
    fs.appendFile(logFile,'\n\nOpening New Connection: '+date,function(err){if (err) throw err;}) 
    fs.appendFile(logFile,'\n\nPayload: '+JSON.stringify({bbox:bboxInput,eventTypes:inputEvent}),function(err){if (err) throw err;})  
    ws.send(JSON.stringify({bbox:bboxInput,eventTypes:inputEvent}));
  })
  // when a message is returned send to the outputFile 
  ws.on('message', data => {
    fs.appendFile(outputFile,'\n'+data, function(err){
      if (err) throw err;
    })
  })
  // when an error occurs send to log file
  ws.on('error', err => {
    var date = new Date()
    fs.appendFile(logFile,err +'\nError at:'+date,function(err){
      if (err) throw err;
    })
  })
}

listen() 
