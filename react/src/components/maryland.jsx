import React, { Fragment, Component } from "react";
import { array } from "prop-types";
import classnames from "classnames";
import moment from "moment";
import { toString, isArray } from "lodash";

// return empty string if no date
moment.updateLocale(moment.locale(), { invalidDate: "" });

class MarylandForm extends Component {
  static propTypes = {
    questions: array.isRequired,
  };

  constructor(props) {
    super(props);
    this.dateFormat = "MM/D/YYYY";
    this.timeFormat = "h:mm A";
    this.dateTimeFormat = "MM/D/YYYY h:mm A";
  }

  getNumberSpan = i => {
    return <span className="space-right">{i + 1}.</span>;
  };

  getLabel = (i, { input_label, description }) => {
    return (
      <label className="bold">
        {this.getNumberSpan(i)}
        {input_label}
        {description && <span className="space-left">({description})</span>}:
      </label>
    );
  };

  getAnswer = (i, { answer, comment }) => {
    const dateQuestions = [3, 9];
    const timeQuestions = [4, 5];
    const dateTimeQuestions = [13];

    const displayAnswer =
      dateQuestions.indexOf(i) > -1
        ? moment(answer).format(this.dateFormat)
        : timeQuestions.indexOf(i) > -1
        ? moment(answer).format(this.timeFormat)
        : dateTimeQuestions.indexOf(i) > -1
        ? moment(answer).format(this.dateTimeFormat)
        : answer;

    return comment ? (
      <div>
        <p>{displayAnswer}</p>
        <p>{comment}</p>
      </div>
    ) : (
      <p className="width-auto inline">{displayAnswer}</p>
    );
  };

  renderFullRow = i => {
    const question = this.props.questions[i];

    console.log(question);

    return (
      <tr key={i}>
        <td colSpan="4">
          {this.getLabel(i, question)}
          <div>
            {question.options.length
              ? this.renderCheckboxes(i, question)
              : this.getAnswer(i, question)}
          </div>
        </td>
      </tr>
    );
  };

  renderHalfRow = i => {
    const question = this.props.questions[i];

    return (
      <tr key={i}>
        <td>{this.getLabel(i, question)}</td>
        <td colSpan="3">
          {question.options.length
            ? this.renderCheckboxes(i, question)
            : this.getAnswer(i, question)}
        </td>
      </tr>
    );
  };

  renderQuarterRow = i => {
    return (
      <tr key={i}>
        {Array.from({ length: 2 }, (_, i) => i).map(ii => {
          const index = i + ii;
          const question = this.props.questions[index];
          return (
            <Fragment key={index}>
              <td>{this.getLabel(index, question)}</td>
              <td>{this.getAnswer(index, question)}</td>
            </Fragment>
          );
        })}
      </tr>
    );
  };

  renderCheckboxes = (i, { options, answer }) => {
    const selectedAnswer = JSON.parse(answer) ? JSON.parse(answer) : answer;

    return (
      <Fragment>
        {options.map((option, ii) => (
          <Fragment key={option.id}>
            <p className="inline-block width-auto">
              <span
                className={classnames(
                  "checkbox",
                  // for multi-select
                  (isArray(selectedAnswer) && selectedAnswer[ii] === true) ||
                    // for single-select
                    (!isArray(selectedAnswer) && answer === toString(option.id))
                    ? "checked"
                    : null
                )}
              />
              <span className="space-left margin-right">{option.name}</span>
            </p>

            {/* child questions */}
            {option.child_questions.length
              ? option.child_questions.map(question => (
                  <div key={question.id}>
                    <label className="inline space-right">
                      {question.input_label}:
                    </label>
                    <p className="inline">{question.answer}</p>
                  </div>
                ))
              : null}
          </Fragment>
        ))}
        {/* follow up questions */}
        {i === 12 ? (
          <div>
            <p className="bold">If yes, provide:</p>
            {Array.from({ length: 3 }, (_, ii) => ii).map(ii => {
              const index = i + ii + 1;
              const question = this.props.questions[index];

              console.log("hi", question, index);
              return (
                <div key={`follow-up-${index}`}>
                  <label className="inline space-right">
                    {question.input_label}:
                  </label>
                  {this.getAnswer(index, question)}
                </div>
              );
            })}
          </div>
        ) : null}
      </Fragment>
    );
  };

  render() {
    const { questions } = this.props;

    return (
      <Fragment>
        <section>
          <h1 className="center">
            STANDARD INSPECTION FORM FOR MARYLAND DEPARTMENT OF THE ENVIRONMENT
            GENERAL PERMIT FOR STORMWATER ASSOCIATED WITH CONSTRUCTION ACTIVITY
          </h1>
        </section>

        <table>
          <tbody>
            <tr>
              <td colSpan="4" className="bg-grey bold center">
                General Information
              </td>
            </tr>
            {questions.map((_, i) => {
              // 1 question / row
              if (i === 11 || i === 12) return this.renderFullRow(i);
              // 2 questions / row
              if (i === 0 || i === 1 || (i >= 6 && i <= 10))
                return this.renderHalfRow(i);
              // 4 questions / row
              else if (i === 2 || i === 4) return this.renderQuarterRow(i);
              // done!
              else return null;
            })}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

export default MarylandForm;
