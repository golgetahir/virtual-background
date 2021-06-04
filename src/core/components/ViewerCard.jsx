import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import React, { useEffect, useState } from 'react'
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
  var camerastream = null

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


  async function getCameraStream() {
    console.log("get camera stream called")
    try {
      const constraint = { video: true }
      camerastream = await navigator.mediaDevices.getUserMedia(constraint)
      if (props.videoRef.current) {
        props.videoRef.current.srcObject = camerastream
        return camerastream
      }
    } catch (error) {
      console.error('Error opening video camera.', error)
    }
    setLoading(false)
    setCameraError(true)
    console.log("bu stream bu = " + camerastream)
    return camerastream
  }
  
async function getDesktopStream(){
  console.log("get screen share stream called")
    try {
      const constraint = { video: true }
      const stream = await navigator.mediaDevices.getDisplayMedia(constraint)
      if (props.videoRef.current) {
        props.videoRef.current.srcObject = stream
        return
      }
    } catch (error) {
      console.error('Error opening video camera.', error)
    }
    setLoading(false)
    setCameraError(true)
    //return stream
  }

  
  useEffect(() => {

    if(props.adaptorRef.current === undefined || props.adaptorRef.current === null){
      console.log("type check = " + props.sourceConfig.audio)
      
      if (props.sourceConfig.type === 'camera') {
        getCameraStream()
      }
      else if(props.sourceConfig.type === 'screen'){
        props.backgroundConfig.type='none' 
        getDesktopStream();
      } 
      else if (props.videoRef.current) {
        props.videoRef.current.srcObject = null
        props.videoRef.current.play()
      }
    }
    else{
      if (props.sourceConfig.type === 'camera') {
        camerastream = getCameraStream().then(()=>{
          console.log("bu stream bu 2= " + camerastream)
          console.log("cavasRef2= " + props.canvasRef.current)
          var timerID = setInterval(
            () => {props.adaptorRef.current.updateVideoTrack(props.canvasRef, props.streamId); console.log("canvreffff = " + props.canvasRef.current); clearInterval(timerID)},
            1000
          );
        })
      }
      else if(props.sourceConfig.type === 'screen'){
        getDesktopStream();
        props.backgroundConfig.type='none' 
        var timerID = setInterval(
          () => {props.adaptorRef.current.updateVideoTrack(props.canvasRef, props.streamId); console.log("canvreffff = " + props.canvasRef.current); clearInterval(timerID)},
          7000
          );
      } 
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
          ref={props.videoRef}
          className={classes.sourcePlayback}
          src={sourceUrl}
          hidden={isLoading}
          autoPlay
          playsInline
          controls={false}
          loop
          muted
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
