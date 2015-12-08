/**
 * @prop onChange - function that is called onChange for inputs, updates program_id
 */
class ProgramFilterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { programs: [] };
    }

    componentDidMount() {
        this._fetchPrograms();
    }

    _fetchPrograms() {
        const success = (data) => { this.setState({ programs : data }) }
        APIRequester.getJSON(APIConstants.programs.collection, success);
    }

    render() {
        const programNames = this.state.programs.map((program) => {
            return (
                <option key={program.id} value={program.id}>
                    {program.name}
                </option>
            );
        });

        return (
            <div className="dropdown form-group">
                <select name="program_id" onChange={this.props.onChange} className="program-select form-control" id="module">
                    <option value="">All Programs</option>
                    { programNames }
                </select>
            </div>
        );
    }
}

ProgramFilterModal.propTypes = {
    onChange: React.PropTypes.func.isRequired,
};
