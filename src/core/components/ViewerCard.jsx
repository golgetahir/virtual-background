import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useEffect, useState } from 'react'
import OutputViewer from './OutputViewer'
import SourceViewer from './SourceViewer'

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
  const [sourcePlayback, setSourcePlayback] = useState<SourcePlayback>(null)

  useEffect(() => {
    setSourcePlayback(undefined)
  }, [props.sourceConfig])

  return (
    <Paper className={classes.root}>
      <SourceViewer
        sourceConfig={props.sourceConfig}
        onLoad={setSourcePlayback}
      />
      {sourcePlayback && props.bodyPix && props.tflite ? (
        <OutputViewer
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
      minHeight: `calc(min(${minHeight.join(', ')}))`,
      display: 'flex',
      overflow: 'hidden',

      [theme.breakpoints.up('md')]: {
        gridColumnStart: 1,
        gridColumnEnd: 3,
      },

      [theme.breakpoints.up('lg')]: {
        gridRowStart: 1,
        gridRowEnd: 3,
      },
    },
    noOutput: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  })
})

export default ViewerCard
