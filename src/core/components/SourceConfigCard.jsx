import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import VideocamIcon from '@material-ui/icons/Videocam'
import SelectionIconButton from '../../shared/components/SelectionIconButton'

/*type SourceConfigCardProps = {
  config: SourceConfig
  onChange: (config: SourceConfig) => void
}*/

function SourceConfigCard(props) {
  const classes = useStyles()

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
      </CardContent>
    </Card>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flex: 1,
      [theme.breakpoints.up('md')]: {
        gridColumnStart: 3,
        gridColumnEnd: 4,
      },

      [theme.breakpoints.up('lg')]: {
        gridRowStart: 1,
        gridRowEnd: 2,
      },
    },
  })
)

export default SourceConfigCard
