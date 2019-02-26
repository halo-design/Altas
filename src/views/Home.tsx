import * as React from 'react';

class HomeView extends React.Component {
  public recordStream: any = null;
  private videoEl: any = null;
  private camReady : boolean = false;

  public componentDidMount () {
    navigator.mediaDevices.getUserMedia({ video: {  width: 480, height: 320 } })
      .then((stream) => {
        this.camReady = true;
        if (this.videoEl) {
          this.videoEl.srcObject = stream;
          this.recordStream = stream;
        }
      })
      .catch((err => {
        console.log('设备不支持视频录制');
      }));
    }

    public componentWillUnmount () {
    this.videoEl.pause();
    this.videoEl.currentTime = 0;
    if (this.camReady) {
      this.recordStream.getTracks().forEach((track: any): void => {
        track.stop();
      });
    }
  }

  public render() {
    return (
      <div className="App">
        <div className="logo" />
        <h1>Awesome Nail!</h1>
        <video ref={node => { this.videoEl = node }} autoPlay={true} muted={true} />
      </div>
    )
  }
}

export default HomeView
