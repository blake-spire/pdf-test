import React, { Fragment, Component } from "react";
import { array } from "prop-types";
import classnames from "classnames";
import moment from "moment";

// return empty string if no date
moment.updateLocale(moment.locale(), { invalidDate: "" });

class ColoradoForm extends Component {
  static propTypes = {
    questions: array.isRequired,
  };

  constructor(props) {
    super(props);
    this.dateFormat = "MM/D/YYYY";
    this.timeFormat = "h:mm A";
  }

  getQuestionNumber = i => {
    return <span className="space-right">{i + 1}.</span>;
  };

  renderTableQuestion = i => {
    const question = this.props.questions[i];
    return (
      <Fragment>
        <td>
          <label>
            {this.getQuestionNumber(i)}
            {question.input_name}
          </label>
        </td>
        <td>
          <p>{question.answer}</p>
        </td>
      </Fragment>
    );
  };

  render() {
    const { questions } = this.props;
    console.log(questions);

    return (
      <Fragment>
        {/* first section */}
        <table>
          <tbody>
            {/* first row is tricky because it has a header */}
            {this.renderTableQuestion(0)}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

export default ColoradoForm;
