import * as React from 'react'
import { styled } from '@mui/material/styles'
import {
  Dialog,
  DialogTitle,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material'

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5
        }
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff'
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
      }
    }
  })
)

const ReactComponent = () => {
  React.useEffect(() => {
    if (!document.getElementById('se1')) {
      // gross
      // @ts-ignore
      const siteId = craftercms.getStore().getState().sites.active

      // @ts-ignore
      const baseAddress =
        '/studio/1/plugin/file' +
        '?type=apps' +
        '&name=awsmedialiveconsole' +
        '&pluginId=org.rd.plugin.awsmedialiveconsole' +
        `&siteId=${siteId}`

      const se1 = document.createElement('script')
      se1.src = baseAddress + '&filename=video.js'
      se1.id = 'se1'
      document.head.appendChild(se1)
      const se2 = document.createElement('script')
      se2.src = baseAddress + '&filename=videojs-dash.js'
      document.head.appendChild(se2)
    }

    dataLoadChannels()

    const intervalRef = setInterval(() => {
      dataLoadChannels()
    }, 10000)

    return () => {
      clearInterval(intervalRef)
    }
  }, [])

  const dataLoadChannels = () => {
    // @ts-ignore
    const siteId = craftercms.getStore().getState().sites.active
    // @ts-ignore
    const serviceUrl =
      '/studio/api/2/plugin/script/plugins/org/rd/plugin/awsmedialiveconsole/medialiveconsole/list.json' +
      `?siteId=${siteId}`

    // @ts-ignore
    CrafterCMSNext.util.ajax.get(serviceUrl).subscribe((response) => {
      setState({ ...state, channels: response.response.result })
    })
  }

  const handleToggleOn = (channelId) => {
    // @ts-ignore
    const siteId = craftercms.getStore().getState().sites.active
    // @ts-ignore
    const serviceUrl =
      '/studio/api/2/plugin/script/plugins/org/rd/plugin/awsmedialiveconsole/medialiveconsole/control.json' +
      `?siteId=${siteId}` +
      '&action=start' +
      `&channelId=${channelId}`
    // @ts-ignore
    CrafterCMSNext.util.ajax.get(serviceUrl).subscribe((response) => {
      dataLoadChannels()
    })
  }

  const handleToggleOff = (channelId) => {
    // @ts-ignore
    const siteId = craftercms.getStore().getState().sites.active
    // @ts-ignore
    const serviceUrl =
      '/studio/api/2/plugin/script/plugins/org/rd/plugin/awsmedialiveconsole/medialiveconsole/control.json' +
      `?siteId=${siteId}` +
      '&action=stop' +
      `&channelId=${channelId}`
    // @ts-ignore
    CrafterCMSNext.util.ajax.get(serviceUrl).subscribe((response) => {
      dataLoadChannels()
    })
  }

  const handleToggleChannel = (currentState, channelId) => {
    if (!currentState) {
      handleToggleOn(channelId)
    } else {
      handleToggleOff(channelId)
    }
  }

  const closePreview = () => {
    // @ts-ignore
    const playerEl = document.getElementById('example-video')
    // @ts-ignore
    videojs(playerEl).dispose()
    // @ts-ignore
    window.awsMPVideoPlayer = null

    setLightBoxOpen(false)
  }

  const previewDestination = (videoSrcUrl) => {
    setLightBoxOpen(open)

    window.setTimeout(function () {
      // @ts-ignore
      const player = window.awsMPVideoPlayer

      if (!player) {
        // @ts-ignore
        const playerEl = document.getElementById('example-video')
        // @ts-ignore
        const player = videojs(playerEl)
        // @ts-ignore
        window.awsMPVideoPlayer = player
      }

      // @ts-ignore
      const videoType = videoSrcUrl.indexOf('m3u8') !== -1 ? 'application/vnd.apple.mpegurl' : 'application/dash+xml'
      player.src({ src: videoSrcUrl, type: videoType })
      player.play()
    }, 1500)
  }

  const [open, setOpen] = React.useState(false)
  const [lightBoxOpen, setLightBoxOpen] = React.useState(false)

  const [state, setState] = React.useState({
    channels: {},
    hasMore: true,
    curPage: 0,
    itemsPerPage: 10,
    itemSize: 1
  })

  return (
    <React.Fragment>
      <div
        onClick={() => setOpen(true)}
        className="MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters"
        style={{
          WebkitTapHighlightColor: 'transparent',
          backgroundColor: 'transparent',
          outline: '0px',
          border: '0px',
          margin: '0px',
          borderRadius: '0px',
          cursor: 'pointer',
          userSelect: 'none',
          verticalAlign: 'middle',
          appearance: 'none',
          color: 'inherit',
          display: 'flex',
          WebkitBoxFlex: 1,
          flexGrow: 1,
          WebkitBoxPack: 'start',
          justifyContent: 'flex-start',
          WebkitBoxAlign: 'center',
          alignItems: 'center',
          position: 'relative',
          textDecoration: 'none',
          minWidth: '0px',
          boxSizing: 'border-box',
          textAlign: 'left',
          padding: '8px 16px',
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
      >
        <div
          className="MuiListItemIcon-root"
          style={{
            color: 'rgb(255, 255, 255)',
            flexShrink: 0,
            display: 'inline-flex',
            marginRight: '10px',
            minWidth: 'auto'
          }}
        >
          <svg
            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mui-vubbuv"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="DashboardRoundedIcon"
          >
            <path d="M17 21.5H4a2 2 0 01-2-2v-10a2 2 0 012-2h13a2 2 0 012 2v10a2 2 0 01-2 2zM21 11.5v6l4.445 2.964A1 1 0 0027 19.631V9.369a1 1 0 00-1.555-.832L21 11.5z" />
          </svg>
        </div>
        <div className="MuiListItemText-root mui-1tsvksn">
          <span className="MuiTypography-root MuiTypography-body1 MuiTypography-noWrap MuiListItemText-primary css-typdpm">
            AWS MediaLive Console
          </span>
        </div>
        <svg
          className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mui-vubbuv"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="ChevronRightRoundedIcon"
        >
          <path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
        </svg>
        <span className="MuiTouchRipple-root css-w0pj6f" />
      </div>

      <Dialog fullWidth={false} maxWidth="lg" onClose={() => closePreview()} open={lightBoxOpen}>
        <video id="example-video" style={{ width: 600, height: 300 }} className="video-js vjs-default-skin" controls />
      </Dialog>

      <Dialog fullWidth maxWidth="xl" onClose={() => setOpen(false)} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="max-width-dialog-title">AWS MediaLive Console</DialogTitle>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell align="right">State</TableCell>
                <TableCell align="right">Control</TableCell>
                <TableCell align="right">Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.channels &&
                Object.entries(state.channels as any).map(([channelIdx]) => {
                  const channel = state.channels[channelIdx]
                  const channelSwitchOn = channel.state === 'STARTING' || channel.state === 'RUNNING'
                  const d = Object.entries(channel.destinations as any).map(([destIdx]) => {
                    const dest = channel.destinations[destIdx]

                    const epb = Object.entries(dest.endpoints as any).map(([endpointsIdx]) => {
                      const endpoint = dest.endpoints[endpointsIdx]
                      const buttonLabel = endpoint.description
                      const button = (
                        <div style={{ display: 'block' }}>
                          <Button size="small" color="primary" onClick={() => previewDestination(endpoint.url)}>
                            {buttonLabel}
                          </Button>
                        </div>
                      )
                      return button
                    })

                    return (
                      <tr key={destIdx}>
                        <td>
                          <b>{dest.mediaPackageChannelId}</b>
                        </td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>{epb}</td>
                      </tr>
                    )
                  })

                  const channelPreviewButton = <table>{d}</table>

                  // @ts-ignore
                  return (
                    <TableRow key={channel.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left">
                        <b>{channel.name}</b>
                      </TableCell>
                      <TableCell align="right">{channel.id}</TableCell>
                      <TableCell align="right">{channel.state}</TableCell>
                      <TableCell align="right">
                        <FormControlLabel
                          checked={channelSwitchOn}
                          onChange={() => handleToggleChannel(channelSwitchOn, channel.id)}
                          control={<IOSSwitch />}
                          label=""
                        />
                      </TableCell>
                      <TableCell align="right">{channelPreviewButton}</TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </React.Fragment>
  )
}

export default ReactComponent
