import { define, Component } from '@xinix/xin';
import '../';

class XPane extends Component {
  get props () {
    return Object.assign({}, super.props, {
      qrData: {
        type: String,
        value: '',
      },
    });
  }
}

define('x-pane', XPane);
