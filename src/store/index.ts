import DeviceModel from "../models/DeviceModel";
import UploadModel from "../models/UploadModel";

const stores = {
  device: new DeviceModel(),
  upload: new UploadModel()
};

export default stores;
