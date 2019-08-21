import React, { Fragment, Component } from "react";
import { arrayOf, string, shape, number } from "prop-types";
import classnames from "classnames";
import { zip, isUndefined } from "lodash";

class XcelForm extends Component {
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
            child_questions: arrayOf(
              shape({
                input_label: string,
                answer: string,
              })
            ),
          })
        ),
      })
    ).isRequired,
  };

  renderRow = (i, cellCount) => {
    return (
      <tr key={i}>
        {Array.from({ length: cellCount }, (_, i) => i).map(ii => {
          const index = i + ii;
          const question = this.props.questions[index];

          return (
            <td key={`question-${i}-cell-${ii}`}>
              <label>{question.input_label}:</label>
              <p>{question.answer}</p>
            </td>
          );
        })}
      </tr>
    );
  };

  renderYesNo = i => {
    const question = this.props.questions[i];

    return (
      <Fragment>
        <p
          className={classnames(
            "inline",
            question.answer === "1" ? "answer" : null
          )}
        >
          Yes
        </p>
        <p
          className={classnames(
            "inline",
            question.answer === "2" ? "answer" : null
          )}
        >
          No
        </p>
      </Fragment>
    );
  };

  renderFullWidthRowInline = ({ i, includeYesNo }) => {
    const question = this.props.questions[i];

    return (
      <tr key={i}>
        <td colSpan="2">
          <label className="inline">{question.input_label}:</label>

          {includeYesNo ? (
            this.renderYesNo(i)
          ) : (
            <p className="inline">{question.answer}</p>
          )}
        </td>
      </tr>
    );
  };

  renderFullWidthRow = ({
    i,
    labelClass,
    optionClass,
    optionWrapperClass,
    labelName,
    checkbox,
  }) => {
    const question = this.props.questions[i];
    // get answer
    let answer, isArray;
    if (
      // can't parse an empty string
      question.answer.length &&
      typeof JSON.parse(question.answer) === "object"
    ) {
      isArray = true;
      answer = JSON.parse(question.answer);
    } else {
      isArray = false;
      answer = question.answer;
    }

    return (
      <tr key={i}>
        <td colSpan="2">
          <label className={labelClass}>
            {labelName || question.input_label}
          </label>

          {question.options.length ? (
            <div className={optionWrapperClass}>
              {question.options.map((option, ii) => {
                const isAnswer = isArray
                  ? answer[ii] === true
                  : answer === ii + 14 + "";

                return (
                  <Fragment key={option.name}>
                    <p
                      className={classnames(
                        optionClass,
                        isAnswer && !isArray ? "answer" : null
                      )}
                    >
                      {checkbox && (
                        <span
                          className={classnames(
                            "checkbox",
                            isAnswer && isArray ? "checked" : null
                          )}
                        />
                      )}
                      <span className="space-left">{option.name}</span>
                    </p>
                    {option.description && (
                      <span
                        dangerouslySetInnerHTML={{ __html: option.description }}
                      />
                    )}

                    {option.child_questions.length > 0 ? (
                      <div>
                        {option.child_questions.map((childQuestion, iii) => (
                          <p
                            className="no-margin inline"
                            key={childQuestion.input_label}
                          >
                            <span>{childQuestion.input_label}</span>
                            <span className="blank-underline">
                              {childQuestion.answer}
                            </span>
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          ) : null}
        </td>
      </tr>
    );
  };

  renderSWMPRow = i => {
    const question = this.props.questions[i];

    return (
      <tr key={i}>
        <td className="width-50 td-pad">
          {question.input_label}
          {question.description && (
            <span className="font-small space-left">
              ({question.description})
            </span>
          )}
        </td>
        <td className="center width-5">
          <label className="bold">{question.answer === "1" ? "X" : null}</label>
        </td>
        <td className="center width-5">
          <label className="bold">{question.answer === "2" ? "X" : null}</label>
        </td>
        <td className="center width-5">
          <label className="bold">{question.answer === "3" ? "X" : null}</label>
        </td>
        <td>
          <label className="bold">{question.comment}</label>
        </td>
      </tr>
    );
  };

  renderCMTable = (
    titles,
    [leftQuestionRange, rightQuestionRange],
    isTopTable
  ) => {
    const headers = ["In SWMP Design", "In Use", "Not Needed at this time"];
    const [leftStart, leftEnd] = leftQuestionRange;
    const [rightStart, rightEnd] = rightQuestionRange;

    // get left and right questions and zip them together
    let leftQuestions = [];
    let rightQuestions = [];
    for (let index = leftStart; index <= leftEnd; index++) {
      leftQuestions.push({ index, ...this.props.questions[index] });
    }
    for (let index = rightStart; index <= rightEnd; index++) {
      rightQuestions.push({ index, ...this.props.questions[index] });
    }
    const rows = zip(leftQuestions, rightQuestions);

    return (
      <Fragment>
        {isTopTable ? (
          <Fragment>
            {/* title row */}
            <tr className="bold">
              <td colSpan="8">Control Measures at time of Inspection</td>
            </tr>

            {/* column headers row */}
            <tr>
              {Array.from({ length: 2 }, (_, i) => i).map(i => (
                <Fragment key={i}>
                  <td className="width-20" />
                  {headers.map(header => (
                    <td
                      className="width-10 pad-left pad-right center"
                      key={header}
                    >
                      {header}
                    </td>
                  ))}
                </Fragment>
              ))}
            </tr>
          </Fragment>
        ) : null}
        {/* table titles */}
        <tr>
          {titles.map(title => (
            <td colSpan="4" key={title} className="bold width-50">
              {title}
            </td>
          ))}
        </tr>
        {/* table data */}
        {rows.map((row, i) => this.renderCMRow(row, i))}
      </Fragment>
    );
  };

  renderCMRow = (row, i) => {
    return (
      <tr key={i}>
        {/* each row contains a left and right side */}
        {row.map(question =>
          isUndefined(question) ? (
            <td colSpan="4" key={`undefined-${i}`} />
          ) : (
            <Fragment key={question.index}>
              {/* label cell */}
              <td className="width-20">
                {question.input_label}

                {question.description ? (
                  <span className="font-small space-left">
                    {/* add colon for other question */}
                    {question.input_label === "Other"
                      ? `(${question.description}):`
                      : `(${question.description})`}
                  </span>
                ) : null}
              </td>
              {/* answer cells */}
              {["30", "31", "32"].map(answerValue => (
                <td key={`td-${answerValue}`} className="width-10 center">
                  {question.answer === answerValue ? "X" : null}
                </td>
              ))}
            </Fragment>
          )
        )}
      </tr>
    );
  };

  renderAssessmentRow = i => {
    const question = this.props.questions[i];
    // can't parse an empty string
    const answers = question.answer.length ? JSON.parse(question.answer) : [];

    return (
      <tr key={i}>
        {answers.map((answer, ii) => {
          return <td key={`${i}-${ii}`}>{answer}</td>;
        })}
        <td>{question.comment}</td>
      </tr>
    );
  };

  renderLineQuestion = i => {
    const question = this.props.questions[i];

    return (
      <div key={i} className="margin-bottom">
        <p>{question.input_label}</p>
        <div className="margin-left">{this.renderYesNo(i)}</div>
        {question.description && (
          <p className="margin-left">{question.description}</p>
        )}
      </div>
    );
  };

  render() {
    const { questions } = this.props;

    return (
      <Fragment>
        <table>
          <thead>
            <tr>
              <th colSpan="2">
                <span className="bold">
                  CONSTRUCTION STORMWATER INSPECTION REPORT
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((_, i) => {
              if (i <= 7 && i % 2 === 0) return this.renderRow(i, 2);
              else if (i === 8)
                return this.renderFullWidthRowInline({
                  i,
                  includeYesNo: true,
                });
              else return null;
            })}
          </tbody>
        </table>

        {/* thirds */}
        <table>
          <tbody>
            {questions.map((_, i) => {
              if (i === 9) return this.renderRow(i, 3);
              else return null;
            })}
          </tbody>
        </table>

        {/* halves */}
        <table>
          <tbody>
            {questions.map((_, i) => {
              if (i === 12) return this.renderRow(i, 2);
              else if (i === 14) return this.renderFullWidthRowInline({ i });
              else if (i === 15)
                return this.renderFullWidthRow({
                  i,
                  optionClass: "inline",
                  labelClass: "bold",
                });
              else if (i === 16) return this.renderFullWidthRowInline({ i });
              else if (i === 17)
                return this.renderFullWidthRow({
                  i,
                  labelClass: "bold",
                  optionClass: "no-margin margin-top",
                  optionWrapperClass: "question-margin",
                  labelName: "Type of Inspection",
                  checkbox: true,
                });
              else return null;
            })}
          </tbody>
        </table>

        {/* SWMP */}
        <table>
          <tbody>
            <tr>
              <td colSpan="5">
                <label className="bold">SWMP Management</label>
              </td>
            </tr>

            <tr>
              <td className="width-50" />
              {["Yes", "No", "N/A", "Comments"].map((td, ii) => (
                <td
                  className={classnames(ii < 3 ? "center width-5" : "bold")}
                  key={td}
                >
                  <label className="bold">{td}</label>
                </td>
              ))}
            </tr>

            {questions.map((_, i) => {
              if (i >= 18 && i <= 24) return this.renderSWMPRow(i);
              else return null;
            })}
          </tbody>
        </table>

        {/* CONTROL MEASURES  */}
        <section>
          <table>
            <tbody>
              {this.renderCMTable(
                ["Erosion Control Measures", "Sediment Control Measures"],
                [[25, 34], [35, 45]],
                true
              )}

              {this.renderCMTable(
                [
                  "Control Measures for Special Conditions",
                  "Materials Handling, Spill Prevention, Waste Management and General Pollution Prevention",
                ],
                [[46, 52], [53, 61]],
                false
              )}
            </tbody>
          </table>
        </section>

        {/* GENERAL NOTES */}
        <section>
          <h3>GENERAL NOTES</h3>
          <table>
            <tbody>
              <tr>
                <td className="full-border triple-height align-top pad-left">
                  {questions[62].answer}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* SITE ASSESSMENT TEXT */}
        <section>
          <h3>
            CONSTRUCTION SITE ASSESSMENT ***off site Pollutant Discharges are a
            violation of the Permit and Reason for Stop Work***
          </h3>
          {questions[63].input_label.split("\n").map((text, i) => (
            <p key={`text-${i}`} className="margin-top">
              {text}
            </p>
          ))}
        </section>

        {/* SITE ASSESSMENT TABLE */}
        <table className="margin-top">
          <tbody>
            <tr>
              <td className="bold full-border">Date of Initial Finding</td>
              <td className="bold full-border">
                Location (station #, pole #, intersection, etc)
              </td>
              <td className="bold full-border">Control Measure</td>
              <td className="bold full-border">
                Condition (Inadequate/Maintenance)
              </td>
              <td className="bold full-border">
                Description of Corrective Action/Comment
              </td>
            </tr>
            {questions.map((_, i) => {
              if (i >= 64 && i <= 72) return this.renderAssessmentRow(i);
              else return null;
            })}
          </tbody>
        </table>

        {/* SITE ASSESSMENT FOLLOW-UP QUESTIONS */}
        <section>
          <h3>
            CONSTRUCTION SITE ASSESSMENT ***off site Pollutant Discharges are a
            violation of the Permit and Reason for Stop Work***
          </h3>
          {questions.map((_, i) => {
            if (i === 73 || i === 74) return this.renderLineQuestion(i);
            else return null;
          })}
        </section>
      </Fragment>
    );
  }
}

export default XcelForm;
