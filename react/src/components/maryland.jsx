import React, { Fragment, Component } from "react";
import { arrayOf, string, shape, number } from "prop-types";
import classnames from "classnames";
import moment from "moment";
import { toString, isArray } from "lodash";

// return empty string if no date
moment.updateLocale(moment.locale(), { invalidDate: "" });
const dateFormat = "MM/D/YYYY";
const timeFormat = "h:mm A";
const dateTimeFormat = "MM/D/YYYY h:mm A";

class MarylandForm extends Component {
  static propTypes = {
    questions: arrayOf(
      shape({
        input_label: string.isRequired,
        description: string,
        answer: string,
        comment: string,
        options: arrayOf(
          shape({
            id: number.isRequired,
            name: string.isRequired,
            description: string,
          })
        ),
      })
    ).isRequired,
  };

  getNumberSpan = (i, correction) => {
    const number = correction ? i + 1 - correction : i + 1;
    return <span className="space-right">{number}.</span>;
  };

  getLabel = (i, { input_label, description }, classes, hideNumberSpan) => {
    return (
      <label className={classes}>
        {hideNumberSpan ? null : this.getNumberSpan(i)}
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
        ? moment(answer).format(dateFormat)
        : timeQuestions.indexOf(i) > -1
        ? moment(answer).format(timeFormat)
        : dateTimeQuestions.indexOf(i) > -1
        ? moment(answer).format(dateTimeFormat)
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

    return (
      <tr key={i}>
        <td colSpan="4">
          {this.getLabel(i, question, "bold")}
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
        <td>{this.getLabel(i, question, "bold")}</td>
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
              <td>{this.getLabel(index, question, "bold")}</td>
              <td>{this.getAnswer(index, question)}</td>
            </Fragment>
          );
        })}
      </tr>
    );
  };

  renderCheckboxes = (i, { options, answer }) => {
    const selectedAnswer =
      answer.length && JSON.parse(answer) ? JSON.parse(answer) : answer;

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
                    {this.getLabel(null, question, "inline space-right", true)}
                    {this.getAnswer(null, question)}
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

              return (
                <div key={`follow-up-${index}`}>
                  {this.getLabel(index, question, "inline space-right", true)}
                  {this.getAnswer(index, question)}
                </div>
              );
            })}
          </div>
        ) : null}
      </Fragment>
    );
  };

  renderYesNo = answer => {
    return [["1", "Yes"], ["2", "No"]].map(checkbox => {
      const [val, label] = checkbox;
      return (
        <p key={val} className="no-wrap">
          <span
            className={classnames(
              "checkbox",
              answer === val ? "checked" : null
            )}
          />
          <span className="space-left">{label}</span>
        </p>
      );
    });
  };

  renderPermitCoverageRow = i => {
    const question = this.props.questions[i];
    // can't parse an empty string :(
    const answer = question.answer.length
      ? JSON.parse(question.answer)
      : ["", ""];
    const [checkboxAnswer, dateAnswer] = answer;

    return (
      <tr key={i}>
        <td className="width-5">{this.getNumberSpan(i, 16)}</td>
        <td>{this.getLabel(null, question, null, true)}</td>
        <td>{this.renderYesNo(checkboxAnswer)}</td>
        <td>{question.comment}</td>
        <td>{moment(dateAnswer).format(dateFormat)}</td>
      </tr>
    );
  };

  renderDischargeRow = i => {
    const question = this.props.questions[i];
    const showNumber = [25, 26].indexOf(i) === -1;
    const showCommentRow = i === 26;

    return (
      <Fragment key={i}>
        <tr>
          {showNumber ? (
            <td className="width-5">{this.getNumberSpan(i, 27)}</td>
          ) : null}
          <td colSpan={showNumber ? 1 : 2} className="width-50">
            {this.getLabel(null, question, null, true)}
          </td>
          <td>{this.renderYesNo(question.answer)}</td>
          <td>{question.comment}</td>
        </tr>
        {showCommentRow ? (
          <tr>
            <td colSpan="4">
              <p className="italic">
                A discharge of significant amounts of sediment may be indicated
                by (but is not limited to) observations of the following. Note
                whether any are observed during this inspection:
              </p>
            </td>
          </tr>
        ) : null}
      </Fragment>
    );
  };

  renderBMPRow = i => {
    const question = this.props.questions[i];
    // can't parse an empty string :(
    const answer = question.answer.length
      ? JSON.parse(question.answer)
      : ["", "", ""];
    const [install, maintenance, location] = answer;

    return (
      <tr key={i}>
        <td>{this.getNumberSpan(i, 34)}</td>
        <td>{this.getLabel(null, question, null, true)}</td>
        <td>{this.renderYesNo(install)}</td>
        <td>{this.renderYesNo(maintenance)}</td>
        <td>{location}</td>
        <td>{question.comment}</td>
      </tr>
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

        {/* GENERAL INFO */}
        <table>
          <thead>
            <tr>
              <th colSpan="4" className="bg-grey bold center">
                General Information
              </th>
            </tr>
          </thead>

          <tbody>
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

        {/* PERMIT COVERAGE INFO */}
        <table className="margin-top full-border">
          <thead>
            <tr>
              <th colSpan="5" className="bg-grey bold center">
                Permit Coverage and Plans
              </th>
            </tr>
            <tr>
              {[
                "",
                "Subject",
                "Status",
                "Corrective Action Needed and Notes",
                "Date Corrected",
              ].map(header => (
                <th className="bg-grey bold" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((_, i) => {
              if (i >= 16 && i <= 24) return this.renderPermitCoverageRow(i);
              else return null;
            })}
          </tbody>
        </table>

        {/* DISCHARGE */}
        <table>
          <thead>
            <tr>
              <th colSpan="4" className="bg-grey bold center">
                Discharge of significant amounts of sediment
              </th>
            </tr>
            <tr>
              {["Subject", "Status", "Notes"].map((header, i) => (
                <th
                  key={header}
                  className="bg-grey bold"
                  colSpan={i === 0 ? 2 : 1}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((_, i) => {
              if (i >= 25 && i <= 33) return this.renderDischargeRow(i);
              else return null;
            })}
          </tbody>
        </table>

        {/* BMP */}
        <table>
          <thead>
            <tr>
              <th colSpan="6" className="bg-grey bold center">
                BMPs
              </th>
            </tr>
            <tr>
              {[
                "",
                "BMP/activity (some recommended items to check included below)",
                "Installed/Implemented?",
                "Maintenance Required?",
                "Location",
                "Corrective Action Needed and Notes (note any BMPs required by plans but not yet installed)",
              ].map(header => (
                <td key={header} className="bg-grey bold">
                  {header}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((_, i) => {
              if (i >= 34) return this.renderBMPRow(i);
              else return null;
            })}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

export default MarylandForm;
