var Userbox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadEmpFromServer: function () {
        var amdinvalue = 2;
        if (adminyes.checked) {
            emailervalue = 1;
        }
        if (adminno.checked) {
            emailervalue = 0;
        }
        var values = [empLastf.value, empFirstf.value, empEmailf.value, amdinvalue];
        console.log(values);

        $.ajax({
            url: '/getemp',
            data: {
                'empLast': empLastf.value,
                'empFirst': empFirstf.value,
                'empEmail': empEmailf.value,
                'empAdmin': amdinvalue
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {

                console.log(this.props.data);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadEmpFromServer();
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="insert_box">
                <center>
                    <h2>Search Employee</h2>
                </center>
                <Searchform onEmpSumbit={this.loadEmpFromServer} />
                <br /><br />
                <center>
                    <table name="admin_table" id="admin_table" className="db_output_table">
                        <thead>
                            <th><h2>First Name</h2></th>
                            <th><h2>Last Name</h2></th>
                            <th><h2>Email</h2></th>
                            <th><h2>Admin Status</h2></th>
                        </thead>
                        <UserList data={this.state.data} />
                    </table>
                </center>
            </div>
        );
    }
});
var Searchform = React.createClass({
    //Function to hand the intitial state of the 
    //form
    getInitialState: function () {

        //Return the forms's field at empty or undefined
        return {
            empLastf: "", empFirstf: "", empEmailf: "", empAdminf: ""
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            empAdminf: e.target.value
        });
    },
    handle_submit: function (e) {
        //Stop the default action of the sumbit
        e.preventDefault();
        //Clean the data by trim it while saving the data
        var empLast = this.state.empLastf.trim();
        var empFirst = this.state.empFirstf.trim();
        var empEmail = this.state.empEmailf.trim();
        var empAdmin = this.state.empAdminf;
        var error_string = "";


        this.props.onEmpSumbit({
            empLast: empLast,
            empFirst: empFirst,
            empEmail: empEmail,
            empAdmin: empAdmin
        });
        this.setState({ empLastf: "", empFirstf: "", empEmailf: "", empAdminf: "" })

    },
    //Function validate the email field's input
    validate_email: function (value) {
        // regex expression
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },


    /*Function to setup a basic validate for different protions of the form
 */
    common_validate: function () {
        //Area for validation if used 
        return true;
    },
    //Function that to save the values of the form
    set_value: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    //Function to render the form to the page
    render: function () {
        return (
            <center>
                <form className="Insertform" name="theform" id="theform" onSubmit={this.handle_submit}>
                    <fieldset><legend>Employee Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Employee First Name</th>
                                    <td><TextInput
                                        value={this.state.empFirstf}
                                        uniqueName="empFirstf"
                                        text="Insert Employee First Name"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'empFirstf')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Employee Last Name</th>
                                    <td><TextInput
                                        value={this.state.empLastf}
                                        uniqueName="empLastf"
                                        text="Insert Employee Last Name"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'empLastf')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Employee Email</th>
                                    <td><TextInput
                                        value={this.state.empEmailf}
                                        uniqueName="empEmailf"
                                        text="Insert Employee Email"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.validate_email}
                                        onChange={this.set_value.bind(this, 'empEmailf')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Is the Employee an Admin User?</th>
                                    <td>
                                        <input
                                            type="radio"
                                            name="empAdminf"
                                            id="adminyes"
                                            value="1"
                                            checked={this.state.empAdminf === "1"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />Yes
                                           <input
                                            type="radio"
                                            name="empAdminf"
                                            id="adminno"
                                            value="0"
                                            checked={this.state.empAdminf === "0"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />No
                                        </td>
                                </tr>

                            </tbody>
                        </table>
                        <input type="submit" name="thesubmit" value="Insert" id="thesubmit" />
                    </fieldset>
                </form>
            </center>
        );
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        id={this.props.uniqueName}
                        name={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value}
                        size="45" />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});
var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });
        return (
            <span>{this.props.errorMessage}</span>

        )
    }

});
var UserList = React.createClass({
    render: function () {
        var userNodes = this.props.data.map(function (user) {

            var admin_option = user.EmployeeAdmin;
            if (admin_option == 1) { admin_option = "Yes"; }
            else { admin_option = "No"; }

            //map the data to individual donations
            return (
                <Users
                    firstName={user.EmployeeFirstName}
                    lastName={user.EmployeeLastName}
                    email={user.EmployeeEmail}
                    admin={admin_option}
                    recKey={user.EmployeeID}
                >
                </Users>
            );

        });

        //print all the nodes in the list
        return (
            <tbody>
                {userNodes}
            </tbody>
        );
    }
});
var Users = React.createClass({
    delRecord: function (e) {
        e.preventDefault();
        var upinventkey = this.props.recKey;

        this.handleOrdSumbit({
            empID: upinventkey
        });
    },
    getInitialState: function () {
        return {
            deldata: [],
        };
    },
    handleOrdSumbit: function (data) {
        console.log(data);

        $.ajax({
            url: "/deleteemp",
            dataType: "json",
            type: "POST",
            data: data,
            success: function (data) {
                window.location.reload(true);
            }.bind(this),
            error: function (xhr, status, err) {
                window.location.reload();
                console.log(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (

            <tr>
                <td>

                    {this.props.firstName}
                </td>
                <td>
                    {this.props.lastName}
                </td>
                <td>
                    {this.props.email}
                </td>
                <td>
                    {this.props.admin}
                </td>
                <td>
                    <form onSubmit={this.delRecord}>
                        <input type="submit" value="Delete Record" />
                    </form>
                </td>
            </tr>
        );
    }
});

//Start all here by calling the varaible Loginbox
ReactDOM.render(
    <Userbox />,
    document.getElementById('content_box')
);