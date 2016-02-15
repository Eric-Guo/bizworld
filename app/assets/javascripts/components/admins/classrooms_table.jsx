class ClassroomsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classrooms: [],
            filters: {
                range      : { },
                status     : "active",
                program_id : "1"
            }
        };
    }

    componentDidMount() {
        this._fetchClassrooms();
    }

    _fetchClassrooms = () => {
        const success = (data) => { this.setState({ classrooms: data }) }
        APIRequester.getJSON(APIConstants.admins.classrooms, success,
            this.state.filters);
    }

    _handleDateRangeChange = (startDate, endDate) => {
        const newState = React.addons.update(this.state.filters, {
            range: {
                start: { $set: startDate },
                end:   { $set: endDate }
            }
        });
        this.setState({ filters: newState });
    }

    _handleFilterChange = (e) => {
        // Updates state of filters in a manner that avoids overriding other fields.
        const newState = React.addons.update(this.state.filters, {
            [$(e.target).attr("name")]: { $set: $(e.target).val() }
        });
        this.setState({ filters: newState });
    }

    _generateClassroomCSVLink() {
        const classrooms = this.state.classrooms.map((val) => { return val.id });
        return APIConstants.admins.download_classrooms($.param({
            classrooms : classrooms,
            program_id : this.state.filters.program_id
        }));
    }

    _generateTeacherCSVLink() {
        const classrooms = this.state.classrooms.map((val) => { return val.id });
        return APIConstants.admins.download_teachers($.param({
            classrooms : classrooms,
            program_id : this.state.filters.program_id
        }));
    }

    render() {
        const classrooms = this.state.classrooms.map((classroom) => {
            return (
                <ClassroomsTableRow classroom  = {classroom}
                                    key        = {classroom.id} />
            );
        });

        return (
            <div>
                <div className="admin-filter-container">
                    <form className="filter-form-container">
                        <ClassroomsFilter onFilterChange    = {this._handleFilterChange}
                                          onDateRangeChange = {this._handleDateRangeChange} />
                        <input className="admin-submit-button" name="submit"
                            type="button" value="Apply" onClick={this._fetchClassrooms}/>
                        <a className="button download-button" href={this._generateClassroomCSVLink()}>
                            <span className="fa fa-download"/>
                            Download Assessment Responses
                        </a>
                        <a className="button download-button" href={this._generateTeacherCSVLink()}>
                            <span className="fa fa-download"/>
                            Download Classroom Summaries
                        </a>
                    </form>
                </div>
                <h1 className="admin-table-title">Filtered Classrooms:
                    <span> { this.state.classrooms.length } found</span>
                </h1>
                <table className="table admin-table">
                    <thead id="table-head">
                        <tr>
                            <th>Classroom Name</th>
                            <th>Teacher Name</th>
                            <th>Teacher Email</th>
                            <th>Date Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        { classrooms }
                    </tbody>
                </table>
            </div>
        );
    }
}

/**
 * @prop classroom - the info about this classroom
 */
class ClassroomsTableRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = { classroom: this.props.classroom };
    }

    _handleRowClick = (e) => {
       window.location.href = `/classrooms/${this.props.classroom.id}`;
    }

    _formatTeacherName(teacher) {
        return `${teacher.first_name} ${teacher.last_name}`;
    }

    _formatDateRange(classroom) {
        return `${formatDate(classroom.start_date)} to
            ${formatDate(classroom.end_date)}`;
    }

    render() {
        return (
            <tr onClick={this._handleRowClick}>
                <td>
                    { this.state.classroom.name }
                </td>
                <td>
                    { this._formatTeacherName(this.state.classroom.teacher) }
                </td>
                <td>
                    { this.state.classroom.teacher.email }
                </td>
                <td>
                    { this._formatDateRange(this.state.classroom) }
                </td>
            </tr>
        );
    }
}

ClassroomsTableRow.propTypes = { classroom: React.PropTypes.object.isRequired };
