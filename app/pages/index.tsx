import * as React from 'react'

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  Paper,
} from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import * as _ from 'lodash'
import getConfig from 'next/config'

const config = getConfig()
const staticFolder = _.get(config, 'publicRuntimeConfig.staticFolder')
const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: 360,
    width: '100%',
  },
  root: {
    marginTop: 18,
    width: '100%',
  },
}))

function ListItemLink(props: any) {
  return <ListItem button component='a' {...props} />
}

export default function App() {
  const classes = useStyles()
  const brandObjs = {
    favicon: {
      name: 'HMS Widget SDK',
      alt: 'favicon',
      src: `${staticFolder}/static/images/favicon.png`,
    },
    hms_widget_sdk: {
      name: 'HMS Widget SDK',
      alt: 'HMS Widget SDK',
      src: `${staticFolder}/static/images/favicon.png`,
    },
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid
        className={classes.root}
        container
        direction='row'
        justify='center'
        alignItems='center'
      >
        <Paper className={classes.card}>
          <List
            component='nav'
            aria-label='main menu'
            subheader={
              <ListSubheader component='div' id='nested-list-subheader'>
                Main Menu
              </ListSubheader>
            }
          >
            <ListItemLink href='/patient-search'>
              <ListItemText primary='Demo App' />
            </ListItemLink>
            <ListItemLink href='/embedded-widget'>
              <ListItemText primary='Embedded Widget' />
            </ListItemLink>
          </List>
        </Paper>
      </Grid>
    </React.Fragment>
  )
}