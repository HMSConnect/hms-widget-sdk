import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'

import { AdapterManager } from '../adapters/DataAdapterManager'
import { HMSService } from '../services/HMSServiceFactory' // Initial singleton HMSService

import * as _ from 'lodash'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

class AASApp extends App {
  constructor(props) {
    super(props)
    AdapterManager.createAdapter(_.get(props, 'router.query.mode'))
  }
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>HMS Widget SDK</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    )
  }
}

export default AASApp
