import * as faceapi from 'face-api.js';
import * as React from 'react';
import LineProgress from '../../layouts/LineProgress';
import { getAppDir } from '../../utils/bridge';

import './index.scss';

export interface IFaceState {
  lineProgressHidden: boolean;
  lineProgressTitle: string;
  videoVisible: boolean;
  faceRecognitionOpen : boolean;
  referencePath: string;
}

class FaceView extends React.Component<object, IFaceState> {
  public recordStream: any = null;
  private videoEl: any = null;
  private canvasEl: any = null;
  private reference: any = null;
  private options: any = null;
  private camReady : boolean = false;

  constructor (props: any) {
    super(props);
    this.state = {
      faceRecognitionOpen: false,
      lineProgressHidden: true,
      lineProgressTitle: '正在开启摄像头',
      referencePath: '',
      videoVisible: false,
    };
  }

  public startRecord (success: any) {
    this.setState({
      lineProgressHidden: false,
      videoVisible: true
    })
    navigator.mediaDevices.getUserMedia({ video: {  width: 480, height: 320 } })
      .then((stream) => {
        if (success) {
          success();
        }
        this.camReady = true;
        if (this.videoEl) {
          this.videoEl.srcObject = stream;
          this.recordStream = stream;
        }
      })
      .catch((err => {
        console.log('设备不支持视频录制');
      }))
      .finally(() => {
        this.setState({
          lineProgressHidden: true
        })
      });
  }

  public stopRecord () {
    this.videoEl.pause();
    this.videoEl.currentTime = 0;
    if (this.camReady) {
      this.recordStream.getTracks().forEach((track: any): void => {
        track.stop();
      });
    }
    this.setState({
      faceRecognitionOpen: false,
      videoVisible: false
    })
  }

  public resizeCanvasAndResults<T> (results: T): T {
    const dimensions = this.videoEl;
    const canvas = this.canvasEl;
    const { width, height } = dimensions instanceof HTMLVideoElement
      ? faceapi.getMediaDimensions(dimensions)
      : dimensions;
      
    canvas.width = width;
    canvas.height = height;

    return faceapi.resizeResults(results, { width, height });
  }

  public drawLandmarks(results: any) {
    const resizedResults = this.resizeCanvasAndResults(results);

    faceapi.drawDetection(this.canvasEl, resizedResults.map((det: any) => det.detection));

    const faceLandmarks = resizedResults.map((det: any) => det.landmarks);

    faceapi.drawLandmarks(this.canvasEl, faceLandmarks, {
      color: 'green',
      drawLines: true,
      lineWidth: 2,
    });
  }

  public async onPlay() {
    if (!this.state.faceRecognitionOpen) {
      return
    }

    const videoEl = this.videoEl;

    if (videoEl.paused || videoEl.ended || !faceapi.nets.tinyFaceDetector.params) {
      return setTimeout(() => this.onPlay())
    }

    const result = await faceapi.detectSingleFace(this.videoEl, this.options).withFaceLandmarks().withFaceDescriptor()

    if (result) {
      const faceMatcher = new faceapi.FaceMatcher(result)
      this.drawLandmarks([result])

      if (this.reference) {
        const bestMatch = faceMatcher.findBestMatch(this.reference.descriptor)
        console.log(bestMatch)
      }
    }
  
    setTimeout(() => this.onPlay());

    return result;
  }

  public faceRecognition() {
    const referPath = this.state.referencePath;

    if (!referPath) {
      return
    }

    this.setState({
      faceRecognitionOpen: true
    });

    faceapi.env.monkeyPatch({
      Canvas: HTMLCanvasElement,
      Image: HTMLImageElement,
      ImageData,
      Video: HTMLVideoElement,
      createCanvasElement: () => document.createElement('canvas'),
      createImageElement: () => document.createElement('img')
    })

    getAppDir(async (path: any) => {
      const modelPath = `${path}browser/weights/`;
      await faceapi.loadTinyFaceDetectorModel(modelPath);
      await faceapi.loadFaceLandmarkModel(modelPath);
      await faceapi.loadFaceRecognitionModel(modelPath);

      this.startRecord(async () => {
        this.options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    
        const imgEl = document.createElement('img');

        if (referPath) {
          imgEl.src = referPath;
          this.reference = await faceapi.detectSingleFace(imgEl, this.options).withFaceLandmarks().withFaceDescriptor();
        }
      })
    })
  }

  public handleRefer (e: any) {
    const file = e.target.files[0];
    const baseType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    const fileType = file.type.split('/')[1];
    if (baseType.indexOf(fileType) > -1) {
      this.setState({
        referencePath: file.path
      })
    }
  }

  public componentWillUnmount () {
    this.stopRecord();
  }

  public render() {
    const { faceRecognitionOpen, lineProgressHidden, lineProgressTitle, videoVisible } = this.state;
    return (
      <div className="page-face">
        <div className="camera-video" style={{ display: videoVisible ? '' : 'none' }}>
          <video onPlay={e => this.onPlay()} ref={node => { this.videoEl = node }} autoPlay={true} muted={true} />
          <canvas ref={node => { this.canvasEl = node }} className="overlay" style={{ display: faceRecognitionOpen ? '' : 'none' }} />
        </div>
        <input
          type="file"
          multiple={false}
          accept="image/*"
          onChange={e => this.handleRefer(e)}
          onDrop={e => this.handleRefer(e)}
        />
        {
          videoVisible
          ? <button onClick={e => this.stopRecord()}>关闭摄像头</button>
          : [
            <button key="open-normal" onClick={e => this.startRecord(null)}>开启摄像头</button>,
            <button key="open-face" onClick={e => this.faceRecognition()}>人脸识别</button>
          ]
        }
        <LineProgress hide={lineProgressHidden} title={lineProgressTitle} mask={true} />
      </div>
    )
  }
}

export default FaceView
