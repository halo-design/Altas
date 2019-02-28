import * as faceapi from 'face-api.js';
import { withSnackbar } from 'notistack';
import * as React from 'react';
import LineProgress from '../../layouts/LineProgress';
import { download } from '../../utils/download';
import { setSaveAs } from '../../utils/file';
import { getAppDir } from '../../utils/system';

import './index.scss';

export interface IFaceState {
  lineProgressHidden: boolean;
  lineProgressTitle: string;
  videoVisible: boolean;
  faceRecognitionOpen : boolean;
  referencePath: string;
  photoTaking: boolean;
}

class FaceView extends React.Component<any, IFaceState> {
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
      photoTaking: false,
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
        this.setState({
          videoVisible: false
        })
        this.props.enqueueSnackbar('设备不支持视频录制', { 
          variant: 'info',
        });
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
      photoTaking: false,
      videoVisible: false,
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
      this.props.enqueueSnackbar('请选取一张参照照片', { 
        variant: 'warning',
      });
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

  public base64Image2Blob = (content: any): Blob => {
    const parts = content.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  public savePhoto () {
    const videoEl = this.videoEl;
    const canvasEl = this.canvasEl;

    videoEl.pause();
    this.setState({
      photoTaking: true
    })

    const ctx = canvasEl.getContext('2d');
    const { width, height } = videoEl instanceof HTMLVideoElement
    ? faceapi.getMediaDimensions(videoEl)
    : videoEl;

    canvasEl.width = width;
    canvasEl.height = height;
    ctx.drawImage(videoEl, 0, 0, width, height);

    const content = canvasEl.toDataURL('image/png');
    const blob = this.base64Image2Blob(content);

    setSaveAs(`shot-${Date.now()}.png`, (path) => {
      if (path) {
        const point = path.lastIndexOf('/');

        download(URL.createObjectURL(blob), (params: any) => {
          if (/(cancel|finished|error)/.test(params.status)) {
            this.props.enqueueSnackbar('照片已保存', {
              variant: 'success'
            });
          }
        }, {
          directory: path.substr(0, point),
          filename: path.substr(point + 1),
          openFolderWhenDone: true,
        })
      }
    });
  }

  public takePhoto () {
    if (!this.state.videoVisible) {
      this.props.enqueueSnackbar('请先开启摄像头', { 
        variant: 'warning',
      });
    } else {
      this.savePhoto();
    }
  }

  public resumePhotoTaken () {
    this.setState({
      photoTaking: false
    })
    this.videoEl.play();
  }

  public componentWillUnmount () {
    this.stopRecord();
  }

  public render() {
    const {
      faceRecognitionOpen,
      lineProgressHidden,
      lineProgressTitle,
      photoTaking,
      referencePath,
      videoVisible
    } = this.state;

    return (
      <div className="page-face">
        <div className="camera-video" style={{ display: videoVisible ? '' : 'none' }}>
          <video
            onPlay={e => this.onPlay()}
            ref={node => { this.videoEl = node }}
            autoPlay={true}
            muted={true}
          />
          <canvas
            ref={node => { this.canvasEl = node }}
            className="overlay"
            style={{ display: faceRecognitionOpen ? '' : 'none' }}
          />
        </div>
        <input
          type="file"
          multiple={false}
          accept="image/*"
          onChange={e => this.handleRefer(e)}
          onDrop={e => this.handleRefer(e)}
        />
        <img src={referencePath} width="320"/>
        {
          videoVisible
            ? <button onClick={e => this.stopRecord()}>关闭摄像头</button>
            : [
              <button key="open-normal" onClick={e => this.startRecord(null)}>开启摄像头</button>,
              <button key="open-face" onClick={e => this.faceRecognition()}>人脸识别</button>
            ]
        }
        {
          photoTaking
            ? <button onClick={e => this.resumePhotoTaken()}>继续拍照</button>
            : <button onClick={e => this.takePhoto()}>拍照</button>
        }
        <LineProgress hide={lineProgressHidden} title={lineProgressTitle} mask={true} />
      </div>
    )
  }
}

export default withSnackbar(FaceView);
