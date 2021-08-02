import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import OutputViewer from './OutputViewer'
import SourceViewer from './SourcePlayback'

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
  

  useEffect(() => {
    setSourcePlayback(undefined)
  }, [props.sourceConfig])
  
 

  return (
    <Paper className={classes.root}>
     <SourceViewer
        sourceConfig={props.sourceConfig}
        onLoad={setSourcePlayback}
        videoRef={props.videoRef}
        adaptorRef={props.adaptorRef}
      />
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
