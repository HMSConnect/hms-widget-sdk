import SideMenuWithContent from '@components/base/SideMenuWithContent'
import {
  widgetReducer,
  widgetState,
} from '@components/templates/widget-manager/local-reducers/widgetReducer'
import WigetManagerMenuList from '@components/templates/widget-manager/WidgetManagerMenuList'
import WidgetManagerOutputEvent from '@components/templates/widget-manager/WidgetManagerOutputEvent'
import WidgetManagerParameter from '@components/templates/widget-manager/WidgetManagerParameter'
import {
  IWidgetGroup,
  widgetGalleryAllergyIntoleranceConfig,
  widgetGalleryDiagnosticReportConfig,
  widgetGalleryEncounterConfig,
  widgetGalleryObservationConfig,
  widgetGalleryPatientConfig,
} from '@config'
import {
  AppBar,
  Box,
  Button,
  createStyles,
  CssBaseline,
  Fab,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import RefreshIcon from '@material-ui/icons/Refresh'
import { IStatelessPage } from '@pages/patient-search'
import * as _ from 'lodash'
import MarkdownIt from 'markdown-it'
import { parse, stringify } from 'qs'
import * as React from 'react'
import '../../github-markdown.css'
import routes from '../../routes'

const md = MarkdownIt({ html: true })

const WIDGET_GROUP: IWidgetGroup[] = [
  {
    child: [
      {
        document: require('@assets/embedded-widget/get-started.md').default,
        label: 'Get Started',
        value: 'get-started',
      },
    ],
    label: 'Get Started',
    value: 'get-started',
  },
  {
    child: [
      {
        document: require('@assets/embedded-widget/html-demo/index.md').default,
        label: 'HTML Demo',
        path: '../../static/public/index.html',
        pathType: 'static',
        value: 'html-demo',
      },
    ],
    label: 'HTML Demo',
    value: 'html-demo',
  },
  widgetGalleryPatientConfig,
  widgetGalleryObservationConfig,
  widgetGalleryEncounterConfig,
  widgetGalleryDiagnosticReportConfig,
  widgetGalleryAllergyIntoleranceConfig,
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    code: {
      background: 'rgb(36, 36, 36)',
      borderRadius: 8,
      height: '100%',
      minHeight: '20vh',
      padding: 16,
    },
    eventResponse: {
      height: '30vh',
      overflow: 'scroll',
      padding: theme.spacing(2),
      width: '100%',
    },
    extendedIconLeft: {
      marginLeft: theme.spacing(1),
    },
    iframLayout: {
      display: 'flex',
      minHeight: '60vh',
    },
    iframe: {
      flex: '1 1 auto',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    parameterLayout: {
      height: '100%',
      padding: theme.spacing(2),
    },
    root: {},
    urlInputProps: {
      height: 45,
    },
    widgetGallery: {
      marginBottom: 16,
    },
    widgetGalleryHeader: {
      padding: theme.spacing(2),
    },
    widgetGallerySide: {
      backgroundColor: theme.palette.background.paper,
      height: '100%',
      padding: theme.spacing(2),
      width: '100%',
    },
  }),
)

const WidgetManager: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()
  const iframeRef = React.useRef<null | HTMLIFrameElement>(null)
  const [
    {
      iframeState,
      tabState,
      selectedWidget,
      loading,
      outputs: outputEventData,
    },
    dispatch,
  ] = React.useReducer(widgetReducer, widgetState)

  const { parameters, queryParams, url } = iframeState

  React.useEffect(() => {
    window.addEventListener(
      'message',
      event => {
        if (event.data.eventType !== 'embedded-widget') {
          return
        }
        if (event.data.action === 'REPLACE_ROUTE') {
          dispatch({
            payload: {
              queryParams: parseQueryStr(event.data.path),
            },
            type: 'IFRAME_REPLACE',
          })
        }

        dispatch({ type: 'OUTPUT_ADD_LOG', payload: event.data })
      },
      false,
    )

    return () => {
      console.info('unregister iframe :')
    }
  }, [])

  React.useEffect(() => {
    if (query) {
      // dispatch({ type: 'LOADING' })

      const selectedWidget = findWidget(query.widget)
      const newQueryParams = initialQueryParams(selectedWidget)
      const url = createURL(selectedWidget, null, newQueryParams)

      dispatch({
        payload: {
          iframeState: {
            parameters: initialParameter(selectedWidget),
            queryParams: newQueryParams,
            url,
          },
          selectedWidget,
          tabState: selectedWidget && selectedWidget.path ? 0 : 1,
        },
        type: 'INIT',
      })
    }
  }, [query])

  const parseQueryStr = (queryStr: string) => {
    const queryParams = _.split(queryStr, '?')
    return queryParams[1] ? parse(queryParams[1], { depth: 0 }) : {}
  }

  const findWidget = (widgetValue: string) => {
    const findWidget = _.chain(WIDGET_GROUP)
      .map(widget => widget.child)
      .flatten()
      .find((widget: any) => _.toLower(widget.value) === _.toLower(widgetValue))
      .value()
    return findWidget ? findWidget : WIDGET_GROUP[0].child[0]
  }

  const createURL = (
    selectedWidget: any,
    parameters?: any,
    queryParams?: any,
  ) => {
    let url = _.get(selectedWidget, 'path')
    if (!url) {
      return ''
    }
    if (parameters) {
      _.each(parameters, (value, key) => {
        url = _.replace(url, `:${key}`, value)
      })
    } else {
      _.each(selectedWidget.parameters, parameter => {
        url = _.replace(url, `:${parameter.value}`, parameter.defaultValue)
      })
    }
    if (queryParams) {
      const stringQueryParam = parse(stringify(queryParams), { depth: 0 })
      const newQueryParams = _.reduce(
        stringQueryParam,
        (acc, value, key) => {
          if (value) {
            return { ...acc, [key]: value }
          }
          return acc
        },
        {},
      )
      if (_.isEmpty(newQueryParams)) {
        return `${url}`
      }
      return `${url}?${stringify(newQueryParams)}`
    }

    return url
  }

  const initialParameter = (selectedWidget: any) => {
    return createMapping(
      _.get(selectedWidget, 'parameters'),
      'value',
      'defaultValue',
    )
  }

  const initialQueryParams = (selectedWidget: any) => {
    return createMapping(
      _.get(selectedWidget, 'queryParams'),
      'value',
      'defaultValue',
    )
  }

  const createMapping = (object: any, key: string, value: string) => {
    return _.chain(object)
      .reduce((acc, item) => {
        return {
          ...acc,
          [item[key]]: item[value],
        }
      }, {})
      .value()
  }

  const handleQueryParamChange = (type: string, value: any) => {
    dispatch({
      payload: { type, value },
      type: 'IFRAME_QUERY_PARAMS_CHANGE',
    })
  }

  const handleParameterChange = (type: string, value: any) => {
    dispatch({
      payload: { type, value },
      type: 'IFRAME_PARAMETERS_CHANGE',
    })
  }

  const iframeInitial = () => {
    const iframeObject = _.get(iframeRef, 'current')
      ? (_.get(iframeRef, 'current') as HTMLIFrameElement)
      : null
    if (iframeObject && iframeObject.contentWindow) {
      iframeObject.contentWindow.onpopstate = (event: any) => {
        // setURLText(event.state.url)
      }
    }
  }

  const handleChangeWidget = (widget: any) => {
    dispatch({ type: 'OUTPUT_RESET' })
    routes.Router.replaceRoute(
      `/embedded-widget?widget=${_.toLower(widget.value)}`,
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
    dispatch({ type: 'IFRAME_REFRESH' })
  }

  const handleIFrameReset = (event: React.MouseEvent) => {
    // TODO: iframe reset
    dispatch({ type: 'IFRAME_RESET' })

    if (selectedWidget) {
      routes.Router.replaceRoute(
        `/embedded-widget${
          selectedWidget.value ? `?widget=${selectedWidget.value || ''}` : ''
        }`,
      )
    } else {
      routes.Router.replaceRoute(`/embedded-widget`)
    }
  }

  const handleSubmitURL = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault()
    }

    // clear specific local storage
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('medicalPanelRecord')
    }

    if (selectedWidget && selectedWidget.path) {
      const url = createURL(selectedWidget, parameters, queryParams)
      const iframeObject = _.get(iframeRef, 'current')
        ? (_.get(iframeRef, 'current') as HTMLIFrameElement)
        : null

      if (iframeObject && iframeObject.contentWindow) {
        iframeObject.contentWindow.location.replace(url)
      }
    }
    dispatch({ type: 'IFRAME_SUBMIT' })
  }

  const decodeURI = (uri: string) => {
    if (typeof window !== 'undefined') {
      return window.decodeURI(uri)
    } else {
      return uri
    }
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    dispatch({ type: 'TAB_CHANGE', payload: newValue })
  }

  return (
    <>
      <CssBaseline />
      <SideMenuWithContent
        menuTitle='Embedded Widget'
        appBarTitle={selectedWidget?.label}
        renderMenuList={
          <WigetManagerMenuList
            widgetGroup={WIDGET_GROUP}
            onItemClick={handleChangeWidget}
            selectedWidget={selectedWidget}
          />
        }
      >
        {!loading && (
          <>
            <AppBar position='static' color='default'>
              <Tabs
                value={tabState}
                onChange={handleTabChange}
                indicatorColor='primary'
                textColor='primary'
                variant='scrollable'
                scrollButtons='auto'
              >
                {selectedWidget && selectedWidget.path ? (
                  <Tab label='Playground' id='0' value={0} />
                ) : null}
                <Tab label='Document' id='1' value={1} />
              </Tabs>
            </AppBar>

            <TabPanel value={tabState} index={0}>
              <Grid container>
                {selectedWidget &&
                _.isEmpty(selectedWidget.parameters) &&
                _.isEmpty(selectedWidget.queryParams) ? null : (
                  <Grid item xs={3}>
                    <Paper className={classes.parameterLayout}>
                      <form onSubmit={handleSubmitURL}>
                        <WidgetManagerParameter
                          parameters={parameters}
                          selectedWidget={selectedWidget}
                          onParameterChange={handleParameterChange}
                          type='parameters'
                          label='Parameters'
                        />
                        <WidgetManagerParameter
                          parameters={queryParams}
                          selectedWidget={selectedWidget}
                          onParameterChange={handleQueryParamChange}
                          type='queryParams'
                        />
                        <Grid container justify='flex-end'>
                          <Fab
                            variant='extended'
                            size='medium'
                            color='primary'
                            aria-label='go'
                            type='submit'
                          >
                            Execute
                            <Icon className={classes.extendedIconLeft}>
                              send
                            </Icon>
                          </Fab>
                        </Grid>
                      </form>
                    </Paper>
                  </Grid>
                )}

                <Grid
                  item
                  xs={
                    selectedWidget &&
                    _.isEmpty(selectedWidget.parameters) &&
                    _.isEmpty(selectedWidget.queryParams)
                      ? 12
                      : 9
                  }
                >
                  <Paper className={classes.parameterLayout}>
                    <Grid item xs={12}>
                      <IconButton aria-label='back' onClick={handleIFrameBack}>
                        <NavigateBeforeIcon />
                      </IconButton>
                      <IconButton aria-label='next' onClick={handleIFrameNext}>
                        <NavigateNextIcon />
                      </IconButton>
                      <IconButton
                        aria-label='refresh'
                        onClick={handleIFrameRefresh}
                      >
                        <RefreshIcon />
                      </IconButton>
                      <Button
                        onClick={handleIFrameReset}
                        variant='outlined'
                        aria-label='reset'
                      >
                        Reset
                      </Button>
                    </Grid>
                    <Grid
                      container
                      spacing={4}
                      alignItems='center'
                      alignContent='center'
                    >
                      <Grid item xs={12}>
                        <TextField
                          label='URL'
                          id='outlined-size-small'
                          variant='outlined'
                          fullWidth
                          value={decodeURI(url || '')}
                          disabled
                          InputProps={{ className: classes.urlInputProps }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12} className={classes.iframLayout}>
                        <iframe
                          key={_.get(selectedWidget, 'path')}
                          ref={iframeRef}
                          className={classes.iframe}
                          src={`${url}`}
                          onLoad={iframeInitial}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              {selectedWidget?.path && (
                <WidgetManagerOutputEvent outputEventData={outputEventData} />
              )}
            </TabPanel>
            <TabPanel value={tabState} index={1}>
              <div
                className='markdown-body'
                dangerouslySetInnerHTML={{
                  __html: md.render(
                    _.get(selectedWidget, 'document') || `# Comming soon`,
                  ),
                }}
              ></div>
            </TabPanel>
          </>
        )}
      </SideMenuWithContent>
    </>
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

export default WidgetManager
