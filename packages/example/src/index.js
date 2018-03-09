import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

class Store {
	@observable number = 1
}
const store = new Store()

@observer
class App extends Component {
	render() {
		return <div onClick={() => { store.number++ }}>N: {store.number}</div>

		// return <h1>Hello, Gnoll!</h1>
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
