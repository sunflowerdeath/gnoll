import React from 'react'
import ReactDOM from 'react-dom'

import Button from '@example/ui/lib/Button'

const App = () => (
  <div>
    <h1>Hello!</h1>
    Component from ui: <Button>Button</Button>
  </div>
)

ReactDOM.render(<App />, document.querySelector('.container'))
