import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

class Store {
	@observable number = 1
}
const store = new Store()

@observer
class Example extends Component {
	render() {
		return (
			<div>
				<h1>Hello, world!</h1>
				Number: {store.number}
				<br />
				<button
					onClick={() => {
						store.number++
					}}
				>
					Increase
				</button>
			</div>
		)
	}
}

export default Example
