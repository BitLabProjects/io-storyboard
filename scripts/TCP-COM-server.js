const http = require('http')
const express = require('express')
const app = express()
const serialport = require('serialport')

const port = 3030
const Server = http.createServer(app)
const io = require('socket.io').listen(Server)

const portName = "COM4";

app.use(express.static(__dirname))

const sPort = new serialport(portName, {
  // you'll need to check for a your port name first
  baudRate: 115200
})

let delimiter = [10]
const parser = sPort.pipe(new serialport.parsers.Delimiter({ delimiter : delimiter, includeDelimiter: false }));

sPort.on('open', () => {
  console.log('Serial Port Opened')
  io.on('connection', socket => {
    socket.emit('connected to ' + portName);
    parser.on('data', (data) => {
      //console.log(`COM->TCP: ${data}`);
      socket.emit('fromCOM', data);
    });
    socket.on("toCOM", (data) => {
      //console.log(`TCP->COM: ${data}`);
      sPort.write(data);
    })
  });
});

Server.listen(port, () => {
  console.log(`Express server started on ${port}`)
});