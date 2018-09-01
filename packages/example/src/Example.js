import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

import './styles/css/global.css'
import moduleStyle from './styles/css/module.module.css'
import useVariablesStyle from './styles/css/useVariables.module.css'
import useVariables2Style from './styles/css/useVariables2.module.css'

import './styles/scss/global.scss'
import scssModuleStyle from './styles/scss/module.module.scss'
import scssUseVariablesStyle from './styles/scss/useVariables.module.scss'

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
				<div className={useVariablesStyle.var}>CSS with vars</div>
				<div className={useVariables2Style.var2}>CSS with vars 2</div>

				<h2>SCSS</h2>
				<div className="scss">Global style</div>
				<div className={scssModuleStyle.scss}>Module style</div>
				<div className={scssUseVariablesStyle.var}>SCSS with vars</div>
			</div>
		)
	}
}

export default Example
