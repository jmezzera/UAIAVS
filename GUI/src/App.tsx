import React, { Component, ReactNode } from 'react';
import './App.css';

// assets
import uaiavsLogo from './Assets/Images/uaiavsWhiteLogo.png';

//components
import { createSocket } from './services/sockets';

import Movement from './services/Movement';
import MovementWithSockets from './services/movementSocket';


import MovementComponet from './Components/Movement';
import VideoPlayer from './Components/VideoPlayer';
import ArchiveVideoPlayer from './Components/NewVideoPlayer';
import PowerButton from './Components/Buttons/Power';
import ArchiveButton from './Components/Buttons/Archive';
import Buttons from './Components/Buttons';
import Canvas from './Components/Canvas';
import MySwitch from './Components/Switch';
import VideoList from './Components/Archive/VideoList';
import { RecordingButton, StopButton } from './Components/Buttons/Recording';


import { Sequence } from './Types/Sequences';
import { SetPoint } from './Types/SetPoints';
import IRecording from './services/IRecording';
import Recording from './services/Recording';
import IAngles from './services/IAngles';
import Angles from './services/AnglesSockets';
import IMode from './services/IMode';
import Mode from './services/Mode';

type AppState = {
  position: { x: number, y: number, z: number },
  angles: { theta: number, phi: number },
  showingArchive: boolean,
  recording: boolean,
  showRec: boolean
}

const sequences = [Sequence.Round, Sequence.Middle_Length, Sequence.Middle_Width, Sequence.DIAGONAL];
const setPoints = [SetPoint.CENTER_TOP, SetPoint.LEFT_GOAL, SetPoint.RIGHT_GOAL, SetPoint.CENTER_CENTER];
class App extends Component<{}, AppState> {
  private socket: SocketIOClient.Socket;
  private movement: Movement;
  private anglesController: IAngles;
  private recordingController: IRecording;
  private modeController: IMode;
  private interval: any;
  constructor(props: any) {
    super(props);
    this.state = {
      position: {
        x: 0, y: 0, z: 0
      },
      angles: {
        theta: 0, phi: 0
      },
      showingArchive: false,
      recording: false,
      showRec: true
    }
    this.positionReceived = this.positionReceived.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);

    this.socket = createSocket();
    this.socket.on('position', this.positionReceived);
    this.socket.on('angle', this.angleReceived);

    this.movement = new MovementWithSockets(this.socket);
    this.anglesController = new Angles(this.socket);
    this.recordingController = new Recording(this.socket);
    this.modeController = new Mode();
  }
  positionReceived(position: { x: number, y: number, z: number }) {
    this.setState({ position });
  }
  angleReceived(angles: { theta: number, phi: number }) {
    this.setState({ angles });
  }
  startRecording(): void {
    if (!this.state.recording) {
      this.recordingController.startRecording();
      this.hideRec();
      this.setState({recording: true})
    }
  }
  stopRecording(): void {
    if (this.state.recording) { 
      this.recordingController.stopRecording();
      this.setState({recording: false})
    }
  }
  hideRec(): void {
    this.interval = setInterval(() => {
      this.setState({showRec: this.state.showRec === true && this.state.recording ? false : true});
    }, 1000)
  }

  renderMainView(): ReactNode {
    return (
      <>
        <div className="leftColumn">
          <div className="switchDiv">
            <MySwitch controller={this.modeController}></MySwitch>
            <div className="operationModeLabels">
              <div className="manual"><strong> Manual </strong></div>
              <div className="automatic"><strong> Automático </strong></div>
            </div>
          </div>
          <div className="positionLabels label">
            <div><strong> x: </strong>{this.state.position.x.toFixed(1)}</div>
            <div><strong> y: </strong>{this.state.position.y.toFixed(1)}</div>
            <div><strong> z: </strong>{this.state.position.z.toFixed(1)}</div>
          </div>
        </div>
        <div className="centerColumn">
          <div className="recordDiv">
            <RecordingButton recording={this.state.recording} onClick={this.startRecording}></RecordingButton>
            <StopButton visible={this.state.recording} onClick={this.stopRecording}></StopButton>
          </div>
          <div className="rec cameraRec2" hidden={!this.state.recording}></div>
          <div className="rec cameraRec" hidden={this.state.showRec}></div>
          <VideoPlayer></VideoPlayer>
          <Buttons setPoints={setPoints} sequences={sequences} movement={this.movement}></Buttons>
        </div>
        <div className="rightColumn">
          <Canvas position={this.state.position}></Canvas>
          <div className="angleLabels label">
            <div><strong> {String.fromCharCode(920)}: </strong>{this.state.position.x.toFixed(1)}</div>
            <div><strong> {String.fromCharCode(934)}: </strong>{this.state.position.y.toFixed(1)}</div>
          </div>
        </div>
        <MovementComponet
          position={this.state.position}
          angles={this.state.angles}
          movement={this.movement}
          anglesController={this.anglesController}
        > </MovementComponet>
        {/* <Positioning
          > </Positioning>
          <Angles>

          </Angles> */}
      </>
    );
  }


  renderArchive(): ReactNode {
    return (
      <div className="test" style={{backgroundColor: "red"}}>
         <div className="leftColumn">
           <VideoList></VideoList>
         </div>
        {/* <ArchiveVideoPlayer ></ArchiveVideoPlayer> */}
      </div>
    )

  }
  render() {
    let view: ReactNode;
    if (this.state.showingArchive)
      view = this.renderArchive();
    else
      view = this.renderMainView();

    return (
      <div className="App">
        <div className="header">
          <ArchiveButton onClick={() => this.setState({showingArchive: !this.state.showingArchive})}> </ArchiveButton>
          <PowerButton></PowerButton>
        </div>
        <div className="main">
          {view}
        </div>
        <div className="footer">
          <img className="logo" alt="UAIAVS" src={uaiavsLogo}></img>
        </div>
      </div>

    )

  }
}

export default App;
