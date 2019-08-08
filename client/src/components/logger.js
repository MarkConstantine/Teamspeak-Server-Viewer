import React from "react";
import { AutoSizer, List } from "react-virtualized";
import moment from "moment";

export default class Logger extends React.Component {
  rowRenderer({ key, index, style }) {
    const {
      client_nickname,
      time_connected,
      time_disconnected
    } = this.props.connections[index];
    const isConnecting = time_disconnected === undefined;
    const dateTimeString = isConnecting
      ? new Date(time_connected)
      : new Date(time_disconnected);
    const dateTimeStringFormatted = moment(dateTimeString).format(
      "MMM DD YYYY, h:mm:ss a"
    );
    const msg = `[${dateTimeStringFormatted}]: ${client_nickname} ${
      isConnecting ? "Connected" : "Disconnected"
    }`;

    return (
      <div key={key} style={style}>
        {msg}
      </div>
    );
  }

  render() {
    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            height={300}
            width={width}
            rowCount={this.props.connections.length}
            rowHeight={23}
            rowRenderer={this.rowRenderer.bind(this)}
          />
        )}
      </AutoSizer>
    );
  }
}
