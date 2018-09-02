import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

import './styles/global.css'
import moduleStyle from './styles/module.module.css'
import './styles/global.scss'
import scssModuleStyle from './styles/module.module.scss'

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

				<h2>CSS</h2>
				<div className="css">Global style</div>
				<div className={moduleStyle.css}>Module style</div>

				<h2>SCSS</h2>
				<div className="scss">Global style</div>
				<div className={scssModuleStyle.scss}>Module style</div>
			</div>
		)
	}
}

export default Example
