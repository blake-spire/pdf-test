import React, { Fragment, Component } from "react";
import { arrayOf, string, shape, number } from "prop-types";
import classnames from "classnames";

import { find, toString } from "lodash";

class ColoradoForm extends Component {
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
          })
        ),
      })
    ).isRequired,
    inspection: shape({
      id: number.isRequired,
      inspector: string.isRequired,
      routine_interval: number.isRequired,
    }).isRequired,
    imageBase64String: string.isRequired,
  };

  getNumberSpan = i => {
    // not so fun. we need to remap numbers :(
    const dashesIndex = [14, 15, 17].indexOf(i);
    const alphaIndex = [
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
    ].indexOf(i);
    // stole from stack overflow because i didn't want to type this out
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    // correct for dashes and alpha numbering
    const numberMap = {
      13: 1,
      16: 2,
      18: 3,
    };

    return (
      <span className="space-right">
        {dashesIndex > -1
          ? "-"
          : alphaIndex > -1
          ? `${alphabet[alphaIndex]}.`
          : `${numberMap[i]}.`}
      </span>
    );
  };

  getAnswerFromOptions = question => {
    const answerOption = find(
      question.options,
      option => toString(option.id) === question.answer
    );
    const answer = answerOption ? answerOption.name : "";

    return answer.indexOf("Routine") > -1
      ? `${answer} (Every ${this.props.inspection.routine_interval} Days)`
      : answer;
  };

  renderTableRow = ([first, second]) => {
    return (
      <tr key={first}>
        {this.renderTableQuestion(first)}
        {this.renderTableQuestion(second)}
      </tr>
    );
  };

  renderTableQuestion = i => {
    const question = this.props.questions[i];

    return (
      <Fragment>
        <td className="width-25">
          <label>
            {/* relabel some questions */}
            {i === 1
              ? "Contractor/Developer"
              : i === 2
              ? "CMS Inspector"
              : question.input_label}
            {question.description && (
              <span className="space-left">({question.description})</span>
            )}
            :
          </label>
        </td>
        <td className="width-25">
          <p>{question.answer}</p>
        </td>
      </Fragment>
    );
  };

  renderSingleCellQuestions = () => {
    const indexes = [8, 9, 10, 11];

    return indexes.map(i => {
      const question = this.props.questions[i];
      return (
        <td key={i} className="width-25">
          <label className="inline">
            {question.input_label}
            {question.description && (
              <span className="space-left">({question.description})</span>
            )}
            :
          </label>
          <p className="inline space-left">{question.answer}</p>
        </td>
      );
    });
  };

  renderHeaderRow = title => {
    return (
      <tr>
        <td className="center bg-grey bold width-50">{title}</td>
        {["YES", "NO", "N/A", "Comments"].map((item, i) => (
          <td
            key={item}
            className={classnames(
              "center bg-grey bold no-pad",
              i === 3 ? "width-35" : "width-5"
            )}
          >
            {item}
          </td>
        ))}
      </tr>
    );
  };

  renderSecondTableRow = ([low, high]) => {
    let questions = [];
    for (let i = low; i <= high; i++) {
      questions.push({ index: i, ...this.props.questions[i] });
    }

    return questions.map(question => {
      return (
        <tr key={question.index}>
          {/* label */}
          <td>
            <div className="inline-flex">
              {this.getNumberSpan(question.index)}
              <label>{question.input_label}</label>
            </div>
          </td>

          {/* answer */}
          {["1", "2", "3"].map(answer => (
            <td key={answer} className="center no-pad-left no-pad-right">
              {question.answer === answer ? "X" : null}
            </td>
          ))}

          {/* comments */}
          <td>{question.comment}</td>
        </tr>
      );
    });
  };

  renderSecondTable = (questionRange, title, tableClasses) => {
    return (
      <table key={title} className={tableClasses}>
        <tbody>
          {this.renderHeaderRow(title)}
          {this.renderSecondTableRow(questionRange)}
        </tbody>
      </table>
    );
  };

  render() {
    const { questions, inspection } = this.props;

    console.log(questions);

    return (
      <Fragment>
        <section className="center">
          <img
            className="height-4"
            src={`data:image/png;base64, ${this.props.imageBase64String}`}
            alt="cms logo"
          />
        </section>

        {/* first section */}
        <table className="full-border">
          <tbody>
            {/* first row is tricky because it has a header */}
            <tr>
              {this.renderTableQuestion(0)}
              <td
                colSpan="2"
                className="bg-grey bold center width-50"
              >{`SWMP FIELD INSPECTION REPORT #${inspection.id}`}</td>
            </tr>

            {/* render remaining rows in a new order */}
            {[[1, 5], [2, 6], [7, 4], [3, 12]].map(pair =>
              this.renderTableRow(pair)
            )}
            <tr>{this.renderSingleCellQuestions()}</tr>
          </tbody>
        </table>

        {/* second section */}
        {questions.map((_, i) => {
          if (i === 13)
            return this.renderSecondTable(
              [13, 17],
              "SWMP Information",
              "margin-top full-border"
            );
          else if (i === 18)
            return this.renderSecondTable([18, 26], "Inspection Scope");
          else if (i === 27)
            return this.renderSecondTable([27, 31], "Inspection Reports");
          else return null;
        })}
      </Fragment>
    );
  }
}

export default ColoradoForm;
