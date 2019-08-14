import React, { Fragment, Component } from "react";
import { array } from "prop-types";
// import classnames from "classnames";
import moment from "moment";
// import { zip, isUndefined } from "lodash";

// return empty string if no date
moment.updateLocale(moment.locale(), { invalidDate: "" });

class DelawareForm extends Component {
  static propTypes = {
    questions: array.isRequired,
  };

  constructor(props) {
    super(props);
    this.dateFormat = "MM/D/YYYY";
    this.timeFormat = "h:mm A";
  }

  render() {
    const { questions } = this.props;

    return <Fragment>hiii </Fragment>;
  }
}

export default DelawareForm;
