import { Paper } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

function StreamIdField(props) {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
       <Typography gutterBottom variant="h6" component="h2">
          StreamId
        </Typography>
    <Paper>
    <InputBase
    fullWidth
    placeholder="stream1"
    id="filled-secondary"
    label="streamId"
    color="secondary"
    onChange= {(event) => props.onChange(event.target.value)}
  />
  </Paper>
  </Card>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flex:1,
      background:'#e9ecef',
      paddingLeft:'7%',
      paddingRight:'7%'
      /*position: 'absolute', left: '25%', top: '77%',
      width: '52%'*/
      //transform: 'translate(-50%, -50%)',*/
      /*[theme.breakpoints.up('md')]: {
        gridColumnStart: 3,
        gridColumnEnd: 4,
      },

      [theme.breakpoints.up('lg')]: {
        gridRowStart: 2,
        gridRowEnd: 3,
      },*/
    },
  })
)

export default StreamIdField