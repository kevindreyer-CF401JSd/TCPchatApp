const net = require('net')
const inquirer = require('inquirer')

const client = new net.Socket()

client.connect(3001, 'localhost', () => {})

let name
const messages = []

function sendMessage (text) {
  let message
  // say "/me smiles"
  if (text.substr(0, 4) === '/me ') { 
    message = `${name} ${text.substr(4)}`
  } else {
    message = `<${name}> ${text}`
  }
  const event = JSON.stringify({
    eventType: 'message',
    payload: `<${name}> ${text}` // <kevin> Hello world
  })
  client.write(event)
}

function sendCommand (text) {
  let message
  // say "/me smiles"
  if (text.substr(0, 4) === '/me ') { 
    message = `${name} ${text.substr(4)}`
  } else {
    message = `<${name}> ${text}`
  }
  const event = JSON.stringify({
    eventType: 'message',
    payload: `<${name}> ${text}` // <kevin> Hello world
  })
  client.write(event)
}

client.on('data', data => {
  const event = JSON.parse(data)
  if (event.eventType === 'message') {
    messages.push(event.payload)
    console.clear()
    messages.forEach(message => console.log(message))
    console.log('')
  }
})

async function getName() {
  console.clear()
  const input = await inquirer.prompt([{name: 'name', message: 'What is your name?' }])
  name = input.name
}

async function getInput() {
  const input = await inquirer.prompt([{name: 'text',message: ' ' }])
  if (input[0] === '/') {
    sendMessage(input.text)
  } else {
    sendMessage(input.text)
  }
  
  getInput()
}

getName()

getInput()