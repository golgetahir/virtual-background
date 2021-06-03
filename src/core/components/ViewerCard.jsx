import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import React, { useEffect, useRef, useState } from 'react'
import OutputViewer from './OutputViewer'

/*type ViewerCardProps = {
  sourceConfig: SourceConfig
  backgroundConfig: BackgroundConfig
  segmentationConfig: SegmentationConfig
  postProcessingConfig: PostProcessingConfig
  bodyPix?: BodyPix
  tflite?: TFLite
}*/

function ViewerCard(props) {
  const classes = useStyles()
  const [sourcePlayback, setSourcePlayback] = useState()
  const [sourceUrl, setSourceUrl] = useState()
  const [isLoading, setLoading] = useState(false)
  const [isCameraError, setCameraError] = useState(false)
  const videoRef = useRef()

  useEffect(() => {
    setSourcePlayback(undefined)
  }, [props.sourceConfig])
  
  useEffect(() => {
    setSourceUrl(undefined)
    setLoading(true)
    setCameraError(false)

    // Enforces reloading the resource, otherwise
    // onLoad event is not always dispatched and the
    // progress indicator never disappears
    setTimeout(() => setSourceUrl(props.sourceConfig.url))
  }, [props.sourceConfig])
  console.log("type check = " + props.sourceConfig.type)
  useEffect(() => {
    async function getCameraStream() {
      console.log("get camera stream called")
      try {
        const constraint = { video: true, audio: true }
        const stream = await navigator.mediaDevices.getUserMedia(constraint)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          return
        }
      } catch (error) {
        console.error('Error opening video camera.', error)
      }
      setLoading(false)
      setCameraError(true)
    }
  async function getDesktopStream(){
    console.log("get screen share stream called")
      try {
        const constraint = { video: true, audio: true }
        const stream = await navigator.mediaDevices.getDisplayMedia(constraint)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          return
        }
      } catch (error) {
        console.error('Error opening video camera.', error)
      }
      setLoading(false)
      setCameraError(true)
    }

    console.log("type check = " + props.sourceConfig.type)
    if (props.sourceConfig.type === 'camera') {
      getCameraStream()
    }
    else if(props.sourceConfig.type === 'screen'){
      getDesktopStream();
    } 
    else if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.play()
    }
  }, [props.sourceConfig])

  function handleVideoLoad(event) {
    const video = event.target
    console.log("video = " + video) 
    setSourcePlayback({
      htmlElement: video,
      width: video.videoWidth,
      height: video.videoHeight,
    })
    setLoading(false)
  }



  return (
    <Paper className={classes.root}>
      {isLoading && <CircularProgress />}
      {isCameraError ? (
        <VideocamOffIcon fontSize="large"/>
      ) : (
        <video 
          ref={videoRef}
          className={classes.sourcePlayback}
          src={sourceUrl}
          hidden={isLoading}
          autoPlay
          playsInline
          controls={false}
          muted
          loop
          onLoadedData={handleVideoLoad}
        />
      )}
      {sourcePlayback && props.bodyPix && props.tflite ? (
        <OutputViewer
          canvasRef={props.canvasRef}
          sourcePlayback={sourcePlayback}
          backgroundConfig={props.backgroundConfig}
          segmentationConfig={props.segmentationConfig}
          postProcessingConfig={props.postProcessingConfig}
          bodyPix={props.bodyPix}
          tflite={props.tflite}
        />
      ) : (
        <div className={classes.noOutput}>
          <Avatar className={classes.avatar} />
        </div>
      )}
    </Paper>
  )
}

const useStyles = makeStyles((theme) => {
  const minHeight = [`${theme.spacing(52)}px`, `100vh - ${theme.spacing(2)}px`]

  return createStyles({
    root: {
      //minHeight: `calc(min(${minHeight.join(', ')}))`,
      //display: 'flex',
      flex:1,
      //paddingRight:'250px',
      //paddingLeft:'250px',
      /*[theme.breakpoints.up('md')]: {
        gridColumnStart: 2,
        gridColumnEnd: 3,
      },

      [theme.breakpoints.up('lg')]: {
        gridRowStart: 1,
        gridRowEnd: 3,
      },*/
    },
    noOutput: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background:'#e9ecef',
    },
    sourcePlayback: {
      visibility: 'hidden',
      display: 'flex',
      width: 0,
      height: 0,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
  })
})

export default ViewerCard
