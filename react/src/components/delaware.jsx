import React, { Fragment, Component } from "react";
import { array } from "prop-types";
import classnames from "classnames";
import moment from "moment";
import { find, toString } from "lodash";

// return empty string if no date
moment.updateLocale(moment.locale(), { invalidDate: "" });

class DelawareForm extends Component {
  static propTypes = {
    questions: array.isRequired,
  };

  constructor(props) {
    super(props);
    this.dateFormatFull = "D MMMM YYYY";
    this.dateFormat = "M/D/YYYY";
    this.timeFormat = "h:mm a";
  }

  getNumberSpan = i => {
    return <span className="space-right">{i + 1}.</span>;
  };

  getURLFromElement = element => {
    return element.match(/href="([^"]*)/)[1];
  };

  renderQuestion = (i, classes) => {
    const question = this.props.questions[i];
    const { div: divClass, p: pClass } = classes;

    return (
      <div key={i} className={classnames("inline-flex margin-top", divClass)}>
        <label className="width-auto space-right no-wrap">
          {this.getNumberSpan(i)}
          {question.input_label}:
        </label>
        <p className={classnames("blank-underline", pClass)}>
          {i === 0
            ? moment(question.answer).format(this.dateFormatFull)
            : i === 1 || i === 2
            ? moment(question.answer).format(this.timeFormat)
            : question.answer}
        </p>
        {question.description && (
          <p>({this.getURLFromElement(question.description)})</p>
        )}
      </div>
    );
  };

  renderCheckbox = i => {
    const question = this.props.questions[i];

    return (
      <div key={i} className="inline-flex margin-top width-100">
        <label className="width-auto space-right no-wrap">
          {this.getNumberSpan(i)}
          {question.input_label}:
        </label>
        {[{ label: "Yes", value: "1" }, { label: "No", value: "2" }].map(
          item => (
            <p className="pad-left pad-right width-auto" key={item.value}>
              <span
                className={classnames(
                  "checkbox",
                  question.answer === item.value ? "checked" : null
                )}
              />
              <span className="space-left">{item.label}</span>
            </p>
          )
        )}
        <p className="width-auto">({question.description})</p>
      </div>
    );
  };

  renderQuestionWithOptions = (i, classes, optionConfig) => {
    const question = this.props.questions[i];
    const { div: divClass, p: pClass } = classes;
    const { includeDescription, displaySingleAnswer } = optionConfig;

    const optionNames = question.options.map(option => option.name);
    const answerOption = find(
      question.options,
      option => toString(option.id) === question.answer
    );

    return (
      <div
        key={i}
        className={classnames("inline-flex margin-top align-center", divClass)}
      >
        <label className="width-auto space-right no-wrap">
          {this.getNumberSpan(i)}
          {question.input_label}
          {includeDescription && (
            <span className="space-left font-small">
              ({optionNames.join(" / ")})
            </span>
          )}
          :
        </label>

        {displaySingleAnswer ? (
          <p className={classnames("blank-underline", pClass)}>
            {answerOption ? answerOption.name : null}
          </p>
        ) : (
          question.options.map(option => (
            <p
              key={option.id}
              className={classnames(
                "width-auto pad-left pad-right",
                toString(option.id) === question.answer ? "answer" : null
              )}
            >
              {option.name}
            </p>
          ))
        )}
      </div>
    );
  };

  renderSiteCompliance = i => {
    const question = this.props.questions[i];
    const answerOption = find(
      question.options,
      option => toString(option.id) === question.answer
    );

    // get answer
    let answer = "";
    if (answerOption) {
      const { name } = answerOption;
      if (name === "Not Applicable") answer = "N/A";
      else if (name === "Satisfactory") answer = "S";
      else if (name === "Unsatisfactory") answer = "U";
    }

    return (
      <div key={i} className="margin-top margin-left inline-flex width-100">
        <label className="width-35">
          {this.getNumberSpan(i)}
          {question.input_label}
        </label>
        <p className="blank-underline-center margin-left center">{answer}</p>
      </div>
    );
  };

  renderWrittenComments = i => {
    const question = this.props.questions[i];
    return (
      <div key={i} className="margin-top margin-left">
        <label className="width-35 bold">
          {this.getNumberSpan(i)}
          {question.input_label}
        </label>
        <p className="pad-left-lg">{question.comment}</p>
      </div>
    );
  };

  render() {
    const { questions } = this.props;

    return (
      <Fragment>
        <section>
          <h3 className="bold center no-margin">CMS Environmental Solutions</h3>
          <h3 className="bold center no-margin">
            Construction Site Stormwater Management
          </h3>
          <h3 className="bold center no-margin">Review Report</h3>
        </section>

        {/* TOP QUESTIONNAIRE */}
        <section>
          {questions.map((_, i) => {
            // set classNames
            let classes = {
              div: "width-100 no-wrap",
              p: "",
            };
            if (i === 0) classes = { ...classes, div: "width-50" };
            else if (i === 1)
              classes = { div: "width-50 justify-end", p: "width-auto" };
            else if (i === 2)
              classes = {
                div: "width-100 justify-end",
                p: "width-auto",
              };
            else if (i === 4) classes = { ...classes, div: "width-65" };
            else if (i === 5)
              classes = { div: "width-35 justify-end", p: "width-auto" };

            // set config for option-type questions
            const optionConfig = {
              includeDescription: i === 10,
              displaySingleAnswer: i === 10,
            };

            // normal questions
            if (i <= 6 || i === 8 || i === 9 || i === 11)
              return this.renderQuestion(i, classes);
            // checkbox questions
            else if (i === 7) return this.renderCheckbox(i);
            // option-type questions
            else if (i === 10 || i === 12)
              return this.renderQuestionWithOptions(i, classes, optionConfig);
            // nothing!
            else return null;
          })}
        </section>

        {/* SITE COMPLIANCE KEY*/}
        <section className="inline-flex ">
          <div className="pad-right">
            {["N/A", "S", "U"].map(item => (
              <p key={item} className="bold margin-top">
                [ {item} ]
              </p>
            ))}
          </div>
          <div>
            {[
              { label: "Not Applicable" },
              { label: "Satisfactory" },
              {
                label: "Unsatisfactory",
                description: "include written comments",
              },
            ].map(item => (
              <p key={item.label} className="margin-top">
                {item.label}
                {item.description && (
                  <span className="font-small space-left">
                    ({item.description})
                  </span>
                )}
              </p>
            ))}
          </div>
        </section>

        {/* SITE COMPLIANCE  */}
        <section>
          {questions.map((_, i) => {
            if (i >= 13 && i <= 22) return this.renderSiteCompliance(i);
            else return null;
          })}
        </section>

        {/* SITE COMPLIANCE WRITTEN COMMENTS */}
        <section className="margin-top">
          <p className="bold">Written Comments:</p>
          {questions.map((_, i) => {
            if (i >= 13 && i <= 22) return this.renderWrittenComments(i);
            else return null;
          })}
        </section>
      </Fragment>
    );
  }
}

export default DelawareForm;
