import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import useRenderingPipeline from '../hooks/useRenderingPipeline';

/*type OutputViewerProps = {
  sourcePlayback: SourcePlayback
  backgroundConfig: BackgroundConfig
  segmentationConfig: SegmentationConfig
  postProcessingConfig: PostProcessingConfig
  bodyPix: BodyPix
  tflite: TFLite
}*/

function OutputViewer(props) {
  const classes = useStyles()
//-----------------------------------------------------------------------------------------------------------------------
  const {
    pipeline,
    backgroundImageRef,
    fps,
    durations: [resizingDuration, inferenceDuration, postProcessingDuration],
  } = useRenderingPipeline(
    props.sourcePlayback,
    props.backgroundConfig,
    props.segmentationConfig,
    props.bodyPix,
    props.tflite,
    props.canvasRef
  )

  useEffect(() => {
    if (pipeline) {
      pipeline.updatePostProcessingConfig(props.postProcessingConfig)
    }
  }, [pipeline, props.postProcessingConfig])

  const statDetails = [
    `resizing ${resizingDuration}ms`,
    `inference ${inferenceDuration}ms`,
    `post-processing ${postProcessingDuration}ms`,
  ]
  const stats = `${Math.round(fps)} fps (${statDetails.join(', ')})`

  return (
    <div className={classes.root}>
      {props.backgroundConfig.type === 'image' && (
        <img
          ref={backgroundImageRef}
          className={classes.render}
          src={props.backgroundConfig.url}
          alt=""
          hidden={props.segmentationConfig.pipeline === 'webgl2'}
        />
      )}
      <canvas
        // The key attribute is required to create a new canvas when switching
        // context mode
        key={props.segmentationConfig.pipeline}
        ref={props.canvasRef}
        className={classes.render}
        width={props.sourcePlayback.width}
        height={props.sourcePlayback.height}
      />
      <Typography className={classes.stats} variant="caption">
        {stats}
      </Typography>
      
    </div>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flex: 1,
      //position:'absolute',
      paddingLeft:'7%',
      paddingRight: '7%',
      paddingTop:'10%',
      /*position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',*/
      background:'#e9ecef'
    },
    render: {
      //position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      background:'lightgray',
    },
    stats: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.48)',
      color: theme.palette.common.white,
    },
  })
)

export default OutputViewer
