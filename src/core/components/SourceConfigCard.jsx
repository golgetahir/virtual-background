import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import { useEffect } from 'react'
import SelectionIconButton from '../../shared/components/SelectionIconButton'

/*type SourceConfigCardProps = {
  config: SourceConfig
  onChange: (config: SourceConfig) => void
}*/

function SourceConfigCard(props) {
  const classes = useStyles()
  
  useEffect(()=>{
    console.log(props.config.audio);
  },[props.config.audio])
  function muteAudio(){
    props.config.audio="disabled"
    if(props.adaptorRef.current !== null & props.adaptorRef.current !== undefined){
      props.adaptorRef.current.muteLocalMic()
      props.audioConfig('disabled')
    }
    else{
      props.config.audio="disabled"
      props.audioConfig('disabled')
    }
  }
  function unmuteAudio(){
    props.config.audio="enabled"
    if(props.adaptorRef.current !== null & props.adaptorRef.current !== undefined){
      props.adaptorRef.current.unmuteLocalMic()
      props.audioConfig('enabled')
    }
    else{
      props.audioConfig('enabled')
    }
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Source
        </Typography>
        <SelectionIconButton
          active={props.config.type === 'camera'}
          onClick={() => props.onChange({ type: 'camera' })}
        >
          <VideocamIcon />
        </SelectionIconButton>
        <SelectionIconButton
          active={props.config.type === 'none'}
          onClick={() => props.onChange({ type: 'none' })}
        >
          <VideocamOffIcon />
        </SelectionIconButton>
        <SelectionIconButton
          active={props.config.type === 'screen'}
          onClick={() => props.onChange({ type: 'screen', audio: 'enabled'  })}
        >
          <ScreenShareIcon />
        </SelectionIconButton>
        <SelectionIconButton
          active={props.config.audio === 'enabled'}
          onClick={unmuteAudio}
        >
          <MicIcon />
        </SelectionIconButton>
        <SelectionIconButton
          active={props.config.audio === 'disabled'}
          onClick={muteAudio}
        >
          <MicOffIcon />
        </SelectionIconButton>
      </CardContent>
    </Card>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flex:1,
      paddingLeft:'20%',
      background:'#e9ecef'
      /*position: 'absolute', left: '25%', top: '98%',
      width: '52%'*/
      /*[theme.breakpoints.up('md')]: {
        gridColumnStart: 3,
        gridColumnEnd: 4,
      },

      [theme.breakpoints.up('lg')]: {
        gridRowStart: 1,
        gridRowEnd: 2,
      },*/
    },
  })
)

export default SourceConfigCard
