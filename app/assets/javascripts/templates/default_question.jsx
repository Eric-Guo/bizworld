/**
 * @prop question - the question to display
 * @prop success  - callback function on successful form update
 */
class DefaultAdminQuestion extends DefaultForm {

    constructor(props) {
        super(props);
        this.state = {
            title    : this.props.question.title,
            editable : false,
            options  : { }
        };
    }

    _attemptSave = (e) => {
        const success = (msg) => {
            this.props.success();
            this.setState({ editable: false });
        }
        APIRequester.put(APIConstants.questions.member(this.props.question.id),
            this.state, success);
    }

    _onTitleChange = (e) => {
        this.setState({ title : $(e.target).val() });
    }

    _renderEditButton() {
        let editButton;
        if (!this.state.editable) {
            editButton = (
                <a className="edit-question-button"
                        onClick={this._toggleEdit} >
                    <span className="fa fa-pencil"/>
                    Edit
                </a>
            );
        }
        return editButton;
    }

    _renderSaveContainer() {
        let saveContainer;
        if (this.state.editable) {
            saveContainer = (
                <div className="edit-button-container">
                    <input name="editable" type="button" value="Cancel"
                        className="button button-small" onClick={this._toggleEdit} />
                    <input type="button" value="Save Changes"
                        className="button-small submit-button"
                        onClick={this._attemptSave} />
                </div>
            );
        }
        return saveContainer;
    }
}

DefaultAdminQuestion.propTypes = {
    question : React.PropTypes.object.isRequired,
    success  : React.PropTypes.func.isRequired
};
