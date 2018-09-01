import React from 'react'
import ReactDOMServer from 'react-dom/server'

import Example from './Example'

export default () => ReactDOMServer.renderToString(<Example />)
