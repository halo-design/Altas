import { inject, observer } from 'mobx-react'
import * as React from 'react';

interface IProps {
  ipAddress: object;
  getIpAddress: (cb?: (data: object) => void)=> void;
}

@inject((stores: any) => {
  const { device: { ipAddress } } = stores;
  return {
    getIpAddress: (cb?: (data: object) => void) => stores.device.getIpAddress(cb),
    ipAddress
  }
})

@observer
class DeviceView extends React.Component<IProps> {
  public componentWillMount () {
    this.props.getIpAddress();
  }

  public render() {
    const { ipAddress } = this.props;
    const items = Object.keys(ipAddress);

    return (
      <div>
        {
          items.map((item: string, i: number) => (
            <div key={i}>
              <span>{ item }:</span>
              <span>{ ipAddress[item] }</span>
            </div>
          ))
        }
      </div>
    );
  }
}

export default DeviceView;
