import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useEffect, useRef, useState } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import BackgroundConfigCard from './core/components/BackgroundConfigCard'
import PublishButtonsCard from './core/components/PublishButtonsCard'
import SourceConfigCard from './core/components/SourceConfigCard'
import StreamIdField from './core/components/StreamIdField'
import ViewerCard from './core/components/ViewerCard'
import {
  backgroundImageUrls
} from './core/helpers/backgroundHelper'
import useBodyPix from './core/hooks/useBodyPix'
import useTFLite from './core/hooks/useTFLite'



function App() {
  const classes = useStyles()
  const canvasRef = useRef()

  //Initialize parameters for segmentation.
  const [sourceConfig, setSourceConfig] = useState({
    type: 'camera',
  })
  const [backgroundConfig, setBackgroundConfig] = useState({
    type: 'image',
    url: backgroundImageUrls[0],
  })

  const [streamId, setStreamId] = useState("stream1");
  
  //By default we use google meet segmentation model and WASM for back end since WASMSIMD is not supported in some cases
  //Meet with webgl2 performs better than canvas2d and bodypix.
  const [
    segmentationConfig,
    setSegmentationConfig,
  ] = useState({
    model: 'meet',
    backend: 'wasm',
    inputResolution: '160x96',
    pipeline: 'webgl2',
  })
  const [
    postProcessingConfig,
  ] = useState({
    smoothSegmentationMask: true,
    jointBilateralFilter: { sigmaSpace: 1, sigmaColor: 0.1 },
    coverage: [0.5, 0.75],
    lightWrapping: 0.3,
    blendMode: 'screen',
  })
  const bodyPix = useBodyPix()
  const { tflite, isSIMDSupported } = useTFLite(segmentationConfig)
  
  useEffect(() => {
    setSegmentationConfig((previousSegmentationConfig) => {
      /*if (previousSegmentationConfig.backend === 'wasm' && isSIMDSupported) {
        return { ...previousSegmentationConfig, backend: 'wasmSimd' }
      } else {*/
        return previousSegmentationConfig
      //}
    })
  }, [isSIMDSupported])

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h6" component="h2" className={classes.typo}>
          WebRTC Publish
        </Typography>
      <Jumbotron fluid className={classes.jumbot}>
        <ViewerCard
          className={classes.Viewer}
          canvasRef={canvasRef}
          sourceConfig={sourceConfig}
          backgroundConfig={backgroundConfig}
          segmentationConfig={segmentationConfig}
          postProcessingConfig={postProcessingConfig}
          bodyPix={bodyPix}
          tflite={tflite}
        />
        <StreamIdField onChange={setStreamId} />
        <PublishButtonsCard canvasRef={canvasRef} streamId={streamId} />
        <SourceConfigCard config={sourceConfig} onChange={setSourceConfig} className={classes.resourceSelectionCards} />
        <BackgroundConfigCard className={classes.resourceSelectionCards}
          config={backgroundConfig}
          onChange={setBackgroundConfig}
        />
      </Jumbotron>
    </div>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      //overflow: 'scroll',
      //display: 'flex',

      /*[theme.breakpoints.up('xs')]: {
        margin: theme.spacing(1),
        gap: theme.spacing(1),
        gridTemplateColumns: '1fr',
      },
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },*/

      paddingLeft:'30%'
    },
    typo: {
      fontSize:'40px',
    },
    streamIdField:{
      flex:1,
      background:'lightgray',
      paddingLeft:'20%',
    },
    jumbot: {
     position: 'absolute', left: '50%', top: '30%',
        transform: 'translate(-50%, -40%)',
      width:'40%',
      height:'60%',
       background:'lightgray'

    }
  })
)

export default App
