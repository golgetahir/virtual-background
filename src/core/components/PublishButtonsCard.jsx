import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from 'react-bootstrap/Button';
import { WebRTCAdaptor } from "../hooks/webrtc_adaptor";

function PublishButtonCard(props) {
  const classes = useStyles();
  var webRTCAdaptor = null;
  var publishStreamId = "stream1"
  var audioStream = null;


  var pc_config = {
    'iceServers' : [ {
      'urls' : 'stun:stun1.l.google.com:19302'
    } ]
  };
    /* 
    //sample turn configuration
    {
        iceServers: [
                      { urls: "",
                        username: "",
                        credential: "",
                      }
                    ]
      };
      */

    var sdpConstraints = {
      OfferToReceiveAudio : false,
      OfferToReceiveVideo : false
    };

    var mediaConstraints = {
      video : true,
      audio : true
    };

  function stopPublishing(){
    console.log("stop called")
    if(props.adaptorRef.current !== null){
      props.adaptorRef.current.stop(publishStreamId)
    }
  }  
  
  async function getMicrophoneStream(){
    console.log("get microphone stream called")
      try {
        const constraint = { audio: true }
        audioStream = await navigator.mediaDevices.getUserMedia(constraint)
        console.log('Audio Stream = ' + audioStream)
        console.log('props adaptorref = ' + props.adaptorRef.current)
      } catch (error) {
        console.error('Error opening video camera.', error)
        }
        return audioStream
      }

  function initWebRTCAdaptor() {
    audioStream = getMicrophoneStream().then(()=>{
      webRTCAdaptor = new WebRTCAdaptor({
        websocket_url : "ws://ovh36.antmedia.io:5080/LiveApp/websocket",
        mediaConstraints : mediaConstraints,
        peerconnection_config : pc_config,
        sdp_constraints : sdpConstraints,
        localVideoId : props.canvasRef,
        audioStream : audioStream,
        debug:true,
        bandwidth:900,
        callback : (info, obj) => {
          if (info === "initialized") {
            console.log("initialized");
            console.log("streamId = " + props.streamId);
            if(props.audioConfig === "disabled"){
              webRTCAdaptor.muteLocalMic();
            }
        
            webRTCAdaptor.publish(props.streamId, null)
            const publishStreamId = props.streamId;
            
            
          } else if (info === "publish_started") {
            //stream is being published
            console.log("publish started");
          } else if (info === "publish_finished") {
            //stream is being finished
            console.log("publish finished");
          }
          else if (info === "browser_screen_share_supported") {
            console.log("browser screen share supported");
          }
          else if (info === "screen_share_stopped") {
            //choose the first video source. It may not be correct for all cases. 
            console.log("screen share stopped");
          }
          else if (info === "closed") {
            //console.log("Connection closed");
            if (typeof obj !== "undefined") {
              console.log("Connecton closed: " + JSON.stringify(obj));
            }
          }
          else if (info === "pong") {
            //ping/pong message are sent to and received from server to make the connection alive all the time
            //It's especially useful when load balancer or firewalls close the websocket connection due to inactivity
          }
          else if (info === "refreshConnection") {
          }
          else if (info === "ice_connection_state_changed") {
            console.log("iceConnectionState Changed: ",JSON.stringify(obj));
          }
          else if (info === "updated_stats") {
            //obj is the PeerStats which has fields
            //averageOutgoingBitrate - kbits/sec
            //currentOutgoingBitrate - kbits/sec
            console.log("Average outgoing bitrate " + obj.averageOutgoingBitrate + " kbits/sec"
                + " Current outgoing bitrate: " + obj.currentOutgoingBitrate + " kbits/sec"
                + " video source width: " + obj.resWidth + " video source height: " + obj.resHeight
                + "frame width: " + obj.frameWidth + " frame height: " + obj.frameHeight
                + " video packetLost: "  + obj.videoPacketsLost + " audio packetsLost: " + obj.audioPacketsLost
                + " video RTT: " + obj.videoRoundTripTime + " audio RTT: " + obj.audioRoundTripTime 
                + " video jitter: " + obj.videoJitter + " audio jitter: " + obj.audioJitter);

          }
          else if (info === "data_received") {
            console.log("Data received: " + obj.event.data + " type: " + obj.event.type + " for stream: " + obj.streamId);
          }
          else if (info === "available_devices") {
          console.log("available devices")
          }
          else {
            console.log( info + " notification received");
          }
        },
        callbackError : function(error, message) {
          //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

          console.log("error callback: " +  JSON.stringify(error));
          var errorMessage = JSON.stringify(error);
          if (typeof message !== "undefined") {
            errorMessage = message;
          }
          errorMessage = JSON.stringify(error);
          if (error.indexOf("NotFoundError") !== -1) {
            errorMessage = "Camera or Mic are not found or not allowed in your device";
          }
          else if (error.indexOf("NotReadableError") !== -1 || error.indexOf("TrackStartError") !== -1) {
            errorMessage = "Camera or Mic is being used by some other process that does not let read the devices";
          }
          else if(error.indexOf("OverconstrainedError") !== -1 || error.indexOf("ConstraintNotSatisfiedError") !== -1) {
            errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints"
          }
          else if (error.indexOf("NotAllowedError") !== -1 || error.indexOf("PermissionDeniedError") !== -1) {
            errorMessage = "You are not allowed to access camera and mic.";
          }
          else if (error.indexOf("TypeError") !== -1) {
            errorMessage = "Video/Audio is required";
          }
          else if (error.indexOf("getUserMediaIsNotAllowed") !== -1){
            errorMessage = "You are not allowed to reach devices from an insecure origin, please enable ssl";
          }
          else if (error.indexOf("ScreenSharePermissionDenied") !== -1) {
            errorMessage = "You are not allowed to access screen share";				
          }
          else if (error.indexOf("WebSocketNotConnected") !== -1) {
            errorMessage = "WebSocket Connection is disconnected.";
          }
          alert(errorMessage);
        }
      })
      props.adaptorRef.current=webRTCAdaptor
    }
    )
    }
    

  return(
    <Card className={classes.root}>
      <CardContent>
      <Button variant="secondary" size="lg" className={classes.butt} onClick={()=>{initWebRTCAdaptor(); props.onChange("initialized") }} > Start Publishing</Button>
      <Button variant="secondary" size="lg" className={classes.butt2} onClick={stopPublishing} > Stop Publishing</Button>
      </CardContent>
    </Card> 
  )
  }

  const useStyles = makeStyles((theme) =>
  createStyles({
    root:{
      flex:1,
      background:'#e9ecef',
      paddingLeft:'25%',
      paddingRight:'7%',
    },
    butt2:{
      marginLeft:'55px',
      marginTop:'25px',
      width: '30%',
      height:'50px',
      color: 'white',
      background:'blue',
      textAlign:'center',
      justifyContent:'center',
      alignItems:'center',
      fontSize:'20px'
    },
    butt:{
     // marginRight:'105px',
      marginTop:'25px',
      width: '30%',
      height:'50px',
      color: 'white',
      background:'blue',
      textAlign:'center',
      justifyContent:'center',
      alignItems:'center',
      fontSize:'20px'
      
      /*[theme.breakpoints.up('md')]: {
        gridColumnStart: 2,
        gridColumnEnd: 3,
      },

      [theme.breakpoints.up('lg')]: {
        gridRowStart: 3,
        gridRowEnd: 4,
      },*/
    },
  })
  )
export default PublishButtonCard