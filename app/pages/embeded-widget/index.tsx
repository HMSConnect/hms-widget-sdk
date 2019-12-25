import React, { useEffect } from 'react'

import {
  AppBar,
  Box,
  Button,
  Collapse,
  createStyles,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import RefreshIcon from '@material-ui/icons/Refresh'
import { makeStyles } from '@material-ui/styles'
import * as _ from 'lodash'
import MarkdownIt from 'markdown-it'
import { ObjectInspector } from 'react-inspector'

import environment from '../../config'
import routes from '../../routes'
import { IStatelessPage } from './patient-search'

const md = MarkdownIt({ html: true })

const widgetGroup = [
  {
    child: [
      {
        document: `# Coming soon`,
        label: 'Patient-search',
        path: 'embeded-widget/patient-search'
      },
      {
        document: `# Coming soon`,
        label: 'Patient-search-bar',
        path: 'embeded-widget/patient-search-bar'
      },
      {
        document: `# Coming soon`,
        label: 'Patient-search-result',
        path: 'embeded-widget/patient-search-result'
      },
      {
        document: `# Coming soon`,
        label: 'Patient-info',
        path: 'embeded-widget/patient-info/0debf275-d585-4897-a8eb-25726def1ed5'
      }
    ],
    label: 'Patient'
  }
]

interface IPostMessage {
  action?: string
  message?: string
  path: string
  params?: any
  result?: any
}

export const sendMessage = (message: IPostMessage) => {
  window.parent.postMessage(message, environment.iframe.targetOrigin)
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    code: {
      background: 'rgb(36, 36, 36)',
      borderRadius: 8,
      height: '100%',
      minHeight: '20vh',
      padding: 16
    },
    eventResponse: {
      minHeight: '30vh',
      padding: theme.spacing(2),
      width: '100%'
    },
    iframLayout: {
      display: 'flex',
      minHeight: '70vh'
    },
    iframe: {
      flex: '1 1 auto'
    },
    nested: {
      paddingLeft: theme.spacing(4)
    },
    root: {},
    widgetGallery: {
      marginBottom: 16
    },
    widgetGalleryHeader: {
      padding: theme.spacing(2)
    },
    widgetGallerySide: {
      backgroundColor: theme.palette.background.paper,
      height: '100%',
      padding: theme.spacing(2),
      width: '100%'
    }
  })
)

const WidgetGallery: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()
  const iframeRef = React.useRef<null | HTMLIFrameElement>(null)
  const [selectedWidget, setSelectedWidget] = React.useState(
    widgetGroup[0].child[0]
  )
  const [outputEventData, setOutputEventData] = React.useState({}) // for event response

  const [widgetURL, setWidgetURL] = React.useState('') // url for iframe
  const [URLText, setURLText] = React.useState('') //  for text input
  const [loading, setLoading] = React.useState(true)
  const [tabState, setTabState] = React.useState(0) // for change tab state

  useEffect(() => {
    window.addEventListener(
      'message',
      event => {
        // if (
        //   event.origin !==
        //   `${process.env.HMS_SANDBOX_URL}${process.env.HMS_SANDBOX_PORT}`
        // ) {
        //   return
        // }
        if (!event.data.message) {
          return
        }
        setOutputEventData(event.data)
        setURLText(event.data.path)
      },
      false
    )
    setLoading(false)

    return () => {
      console.info('unregister iframe :')
      iframeRef.current = null
    }
  }, [])

  useEffect(() => {
    if (query) {
      setLoading(true)
      const findWidget = _.chain(widgetGroup)
        .map(widget => widget.child)
        .flatten()
        .find(child => _.toLower(child.label) === _.toLower(query.widget))
        .value()
      if (findWidget) {
        setSelectedWidget(findWidget)
        setWidgetURL(findWidget.path)
        setURLText(findWidget.path)
      } else {
        setSelectedWidget(widgetGroup[0].child[0])
        setWidgetURL(widgetGroup[0].child[0].path)
        setURLText(widgetGroup[0].child[0].path)
      }
      setLoading(false)
    }
  }, [query])

  const iframeInitial = () => {
    const iframeObject = _.get(iframeRef, 'current')
      ? (_.get(iframeRef, 'current') as HTMLIFrameElement)
      : null
    if (iframeObject && iframeObject.contentWindow) {
      iframeObject.contentWindow.onpopstate = (event: any) => {
        setURLText(event.state.url)
      }
    }
  }

  const handleChangeWidget = (widget: any) => {
    routes.Router.replaceRoute(
      `/embeded-widget?widget=${_.toLower(widget.label)}`
    )
  }

  const handleIFrameBack = (event: React.MouseEvent) => {
    const iframeObject = _.get(iframeRef, 'current')
      ? (_.get(iframeRef, 'current') as HTMLIFrameElement)
      : null
    if (iframeObject && iframeObject.contentWindow) {
      iframeObject.contentWindow.history.back()
    }
  }

  const handleIFrameNext = (event: React.MouseEvent) => {
    const iframeObject = _.get(iframeRef, 'current')
      ? (_.get(iframeRef, 'current') as HTMLIFrameElement)
      : null
    if (iframeObject && iframeObject.contentWindow) {
      iframeObject.contentWindow.history.forward()
    }
  }

  const handleIFrameRefresh = (event: React.MouseEvent) => {
    const iframeObject = _.get(iframeRef, 'current')
      ? (_.get(iframeRef, 'current') as HTMLIFrameElement)
      : null
    if (iframeObject && iframeObject.contentWindow) {
      iframeObject.contentWindow.location.reload()
    }
    setOutputEventData({})
  }

  const handleIFrameReset = (event: React.MouseEvent) => {
    setSelectedWidget(prev => {
      const split = _.split(prev.path, '#')
      return {
        ...prev,
        path: split[1] ? split[0] : split[0] + '#reset'
      }
    })
    setOutputEventData({})
  }

  const handleSubmitURL = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault()
    }
    setWidgetURL(URLText)
  }

  const handleURLTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setURLText(event.target.value)
  }

  const decodeURI = (uri: string) => {
    if (typeof window !== 'undefined') {
      return window.decodeURI(uri)
    } else {
      return uri
    }
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabState(newValue)
  }

  return (
    <>
      <CssBaseline />
      <Grid className={classes.root}>
        <Grid container className={classes.widgetGallery}>
          <Grid item xs={3}>
            <Paper className={classes.widgetGallerySide}>
              <Grid className={classes.widgetGalleryHeader}>
                <Typography variant='h4'>Widget Gallery</Typography>
              </Grid>
              <Divider variant='fullWidth' />
              <List component='nav' aria-labelledby='nested-list-subheader'>
                {_.map(widgetGroup, (widget, index) => (
                  <WidgetGroupListItem key={index} widget={widget}>
                    <List component='div' disablePadding>
                      {_.map(widget.child, (widgetChild, index) => (
                        <React.Fragment
                          key={'widget ' + widget.label + ' ' + index}
                        >
                          <ListItem
                            selected={
                              selectedWidget.label === widgetChild.label
                            }
                            button
                            onClick={() => handleChangeWidget(widgetChild)}
                            className={classes.nested}
                          >
                            <ListItemText primary={widgetChild.label} />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </WidgetGroupListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <AppBar position='static' color='default'>
              <Tabs
                value={tabState}
                onChange={handleTabChange}
                indicatorColor='primary'
                textColor='primary'
                variant='scrollable'
                scrollButtons='auto'
              >
                <Tab label='Playground' id='0' />
                <Tab label='Document' id='1' />
              </Tabs>
            </AppBar>

            <TabPanel value={tabState} index={0}>
              <Grid item xs={4}>
                <IconButton aria-label='back' onClick={handleIFrameBack}>
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton aria-label='next' onClick={handleIFrameNext}>
                  <NavigateNextIcon />
                </IconButton>
                <IconButton aria-label='refresh' onClick={handleIFrameRefresh}>
                  <RefreshIcon />
                </IconButton>
                <Button
                  onClick={handleIFrameReset}
                  color='primary'
                  variant='contained'
                  aria-label='reset'
                >
                  Reset
                </Button>
              </Grid>
              <form onSubmit={handleSubmitURL}>
                <Grid container spacing={3}>
                  <Grid item xs={10}>
                    <TextField
                      id='url-basic'
                      variant='outlined'
                      fullWidth
                      value={decodeURI(URLText)}
                      onChange={handleURLTextChange}
                    />
                  </Grid>
                  <Grid item xs={1} container alignContent='center'>
                    <Button
                      color='primary'
                      variant='contained'
                      aria-label='reset'
                      type='submit'
                    >
                      Go
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {!loading ? (
                <Grid item xs={12} className={classes.iframLayout}>
                  <iframe
                    key={selectedWidget.path}
                    ref={iframeRef}
                    className={classes.iframe}
                    src={`${widgetURL}`}
                    onLoad={iframeInitial}
                  />
                </Grid>
              ) : null}
            </TabPanel>
            <TabPanel value={tabState} index={1}>
              <div
                className='markdown-body'
                dangerouslySetInnerHTML={{
                  __html: md.render(selectedWidget.document)
                }}
              ></div>
            </TabPanel>
          </Grid>
        </Grid>
        <Paper className={classes.eventResponse}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant='h6'>Event Response</Typography>
            </Grid>
            <Grid className={classes.code} item xs={12}>
              <ObjectInspector
                data={outputEventData}
                expandLevel={3}
                theme={'chromeDark'}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  )
}

const WidgetGroupListItem: React.FunctionComponent<{
  widget: any
}> = ({ widget, children }) => {
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }
  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={widget.label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Divider />
      <Collapse in={open} timeout='auto' unmountOnExit>
        {children}
      </Collapse>
    </React.Fragment>
  )
}

const TabPanel: React.FunctionComponent<{
  value: any
  index: number
}> = ({ value, index, children }) => {
  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

WidgetGallery.getInitialProps = async ({ req, res, query }) => {
  // return { hash }
  return {
    query
  }
}

export default WidgetGallery
