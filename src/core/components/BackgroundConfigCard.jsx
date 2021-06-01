import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import BlockIcon from '@material-ui/icons/Block'
import BlurOnIcon from '@material-ui/icons/BlurOn'
import ImageButton from '../../shared/components/ImageButton'
import SelectionIconButton from '../../shared/components/SelectionIconButton'
import {
  backgroundImageUrls
} from '../helpers/backgroundHelper'

/*type BackgroundConfigCardProps = {
  config: BackgroundConfig
  onChange: (config: BackgroundConfig) => void
}
*/
function BackgroundConfigCard(props) {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Background
        </Typography>
        <SelectionIconButton
          active={props.config.type === 'none'}
          onClick={() => props.onChange({ type: 'none' })}
        >
          <BlockIcon />
        </SelectionIconButton>
        <SelectionIconButton
          active={props.config.type === 'blur'}
          onClick={() => props.onChange({ type: 'blur' })}
        >
          <BlurOnIcon />
        </SelectionIconButton>
        {backgroundImageUrls.map((imageUrl) => (
          <ImageButton
            key={imageUrl}
            imageUrl={imageUrl}
            active={imageUrl === props.config.url}
            onClick={() => props.onChange({ type: 'image', url: imageUrl })}
          />
        ))}
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
        gridRowStart: 2,
        gridRowEnd: 3,
      },
    },
  })
)

export default BackgroundConfigCard
