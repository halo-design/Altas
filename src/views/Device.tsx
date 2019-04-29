import { inject, observer } from "mobx-react";
import * as React from "react";

interface IProps {
  ipAddress: object;
  os: object;
  getIpAddress: (cb?: (data: object) => void) => void;
}

@inject((stores: any) => {
  const {
    device: { ipAddress, os }
  } = stores;
  return {
    getIpAddress: (cb?: (data: object) => void) =>
      stores.device.getIpAddress(cb),
    ipAddress,
    os
  };
})
@observer
class DeviceView extends React.Component<IProps> {
  public componentWillMount() {
    this.props.getIpAddress();
  }

  public render() {
    const { ipAddress, os } = this.props;
    const items = Object.keys(ipAddress);
    const osItems = Object.keys(os);

    return (
      <div>
        {items.map((item: string, i: number) => (
          <div key={i}>
            <span>{item}:</span>
            <span>{ipAddress[item]}</span>
          </div>
        ))}
        <br />
        {osItems.map((item: string, i: number) => (
          <div key={i}>
            <span>{item}:</span>
            <span>{JSON.stringify(os[item], null, 2)}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default DeviceView;
