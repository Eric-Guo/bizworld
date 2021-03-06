/**
 * @prop additional_info - string of JSON that holds current classroom responses
 * @prop classroom_id - id associated with the current classroom
 * @prop success - function called when classroom additional info is updated successfully
 */
class AdditionalInfoModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = { questions : this.props.questions, isLoading : false };
    }

    componentDidMount() {
        this._fetchQuestions();
    }

    _fetchQuestions = () => {
        this.setState({ isLoading : true })
        // Attempts to parse JSON, if it is invalid, sets responses to be empty.
        let responses;
        if (this.props.additional_info == null) {
            responses = {}
        } else {
            try {
                responses = JSON.parse(this.props.additional_info);
            } catch (e) {
                responses = {};
            }
        }
        const success = (data) => {
            // Appends preexisting responses to relevant questions.
            data.forEach(function (item, index, array) {
                if (item.id in responses) {
                    item.response = responses[item.id];
                } else {
                    item.response = "";
                }
            });
            this.setState({ questions: data, isLoading : false, responses: responses });
        }
        APIRequester.getJSON(APIConstants.classrooms.questions, success);
    }


    _attemptSave = (e) => {
        const success = (msg) => {
            this.props.success();
        };
        const params = {"additional_info": JSON.stringify(this.state.responses)};
        APIRequester.put(APIConstants.classrooms.member(
            this.props.classroom_id), params, success);
    }


    _handleClassroomInfoChange = (e) => {
        // Updates responses in a manner that avoids overriding other additional info.
        const newState = React.addons.update(this.state.responses, {
            [$(e.target).attr("name")]: { $set: $(e.target).val() }
        });
        this.setState({ responses: newState });
    }

    render() {
        return (
            <div className="action-item additional-info-item">
                <button data-toggle="modal" data-target="#additionalInfoModal"
                    className="button button-small additional-info-item-button">
                    <div>More info</div>
                </button>
                <div className="modal fade" id="additionalInfoModal" tabIndex={-1}
                        role="dialog" ref="modal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    More Info
                                </h4>
                            </div>

                            <div className="modal-body">
                                <QuestionsList questions        = { this.state.questions }
                                               responses        = { this.state.responses }
                                               handleInfoChange = { this._handleClassroomInfoChange } />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="button"
                                    data-dismiss="modal">Cancel</button>
                                <button type="button" name="update-info"
                                        value="Update Info" className="submit-button" onClick={this._attemptSave}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AdditionalInfoModal.propTypes = {
    additional_info : React.PropTypes.string,
    classroom_id    : React.PropTypes.number.isRequired,
    success         : React.PropTypes.func.isRequired
};

AdditionalInfoModal.defaultProps = {
    additional_info: "",
    questions: [],
};

/*
 * @prop questions - array of questions to ask
 * @prop responses - responses object, keeps track of user inputted answers
 * @prop handleInfoChange - for updating responses whenever they change
 */
class QuestionsList extends React.Component {

    render() {
        const questions = this.props.questions.map((question) => {
            return (
                <AdditionalInfoQuestion question  = {question}
                                        key       = {question.id}
                                        handleInfoChange = {this.props.handleInfoChange} />
            );
        });
        return (
            <div>
                { questions }
            </div>
        );
    }

}

QuestionsList.propTypes = {
    questions        : React.PropTypes.array.isRequired,
    responses        : React.PropTypes.object,
    handleInfoChange : React.PropTypes.func.isRequired,
};

/*
 * @prop question - contains metadata for the question (title, hint, initial response)
 * @prop handleInfoChange - for updating responses whenever they change
 */
class AdditionalInfoQuestion extends React.Component {

    render() {
        return (
            <fieldset className="input-container">
                <div className="label-container">
                    <label>
                        { `${this.props.question.title }` }
                    </label>
                </div>
                <div className="hint-container">
                    <p>
                        { this.props.question.hint }
                    </p>
                </div>
                <div>
                    <input name={this.props.question.id} type="text"
                        defaultValue={this.props.question.response}
                        onChange={this.props.handleInfoChange} />
                </div>
            </fieldset>
        )
    }

}

AdditionalInfoQuestion.propTypes = {
    question         : React.PropTypes.object.isRequired,
    handleInfoChange : React.PropTypes.func.isRequired,
}
