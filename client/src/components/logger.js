import React from "react";
import { AutoSizer, List } from "react-virtualized";
import moment from "moment";

export default class Logger extends React.Component {
  rowRenderer({ key, index, style }) {
    const {
      client_nickname,
      time_connected,
      time_disconnected
    } = this.props.connectionHistory[index];
    const isConnecting = time_disconnected === undefined;
    const dateTimeString = isConnecting
      ? new Date(time_connected)
      : new Date(time_disconnected);
    const dateTimeStringFormatted = moment(dateTimeString).format(
      "MMM DD YYYY, h:mma"
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
            rowCount={this.props.connectionHistory.length}
            rowHeight={21}
            rowRenderer={this.rowRenderer.bind(this)}
          />
        )}
      </AutoSizer>
    );
  }
}
