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
    updateSingleUser: function (user) {

        $.ajax({
            url: '/updateemp',
            dataType: 'json',
            data: user,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadEmpFromServer();
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="insert_box">
                <div className="leftBox">
                <center>
                    <h2>Search Employee</h2>
                </center>
                    <Searchform onEmpSumbit={this.loadEmpFromServer} />
                </div>
                <br></br>
                <div id="rightBox">
                    <UserUpdatefor onUPEmpSumbit={this.updateSingleUser} />
                </div>
                <br /><br />
                <center>
                    <table name="admin_table" id="admin_table" className="db_output_table">
                        <thead>
                            <th><h2>First Name</h2></th>
                            <th><h2>Last Name</h2></th>
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
            <div>
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
                        <input type="submit" name="thesubmit" value="Search" id="thesubmit" />
                    </fieldset>
                </form>
                <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
                </div>
            </center>
        </div>
        );
    }
});
var UserUpdatefor = React.createClass({
    //Function to hand the intitial state of the 
    //form
    getInitialState: function () {

        //Return the forms's field at empty or undefined
        return {
            ghempKeyf:"",ghempLastf: "", ghempFirstf: "", ghempEmailf: "", ghempAdminf: ""
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            ghempAdminf: e.target.value
        });
    },
    handle_submit: function (e) {
        //Stop the default action of the sumbit
        e.preventDefault();
        //Clean the data by trim it while saving the data
        var empLast = upuserfirst.value;
        var empFirst = upuserlast.value;
        var empEmail = upuseremail.value;
        var empAdmin = "";
        var empKey = upuserkey.value;
        var error_string = "";
        if (upuseradminyes.checked) {
            empAdmin = 1;
        }
        else {
            empAdmin = 0;
        }

        if (!empLast || !empFirst) {
            error_string += "First or Last name fields are empty please change that or enter NONE if there is no first name";
        }

        if (!this.validate_email(empEmail)) {
            error_string += "\nYour Email is invalid please change that";
        }

        if (empAdmin != 0 && empAdmin != 1) { error_string += "\nPlease select a admin status" }
        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.onUPEmpSumbit({
                empKey:empKey,
                empLast: empLast,
                empFirst: empFirst,
                empEmail: empEmail,
                empAdmin: empAdmin
            });
            this.setState({ empLastf: "", empFirstf: "", empEmailf: "", empPasswordf: "", empAdminf: "" })
        }


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
                <br></br>
                <form className="Insertform" name="theform" id="theform" onSubmit={this.handle_submit}>
                    <fieldset><legend>Update Employee Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Employee First Name</th>
                                    <td><TextInput
                                        uniqueName="upuserfirst"
                                        text="Insert Employee First Name"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'ghempFirstf')}
                                        errorMessage="First Name is invalid"
                                        emptyMessage="First Name is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Employee Last Name</th>
                                    <td><TextInput
                                        uniqueName="upuserlast"
                                        text="Insert Employee Last Name"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'ghempLastf')}
                                        errorMessage="Last Name is invalid"
                                        emptyMessage="Last Name is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Employee Email</th>
                                    <td><TextInput
                                        uniqueName="upuseremail"
                                        text="Insert Employee Email"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.validate_email}
                                        onChange={this.set_value.bind(this, 'ghempEmailf')}
                                        errorMessage="Email is invalid"
                                        emptyMessage="Email is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Is the Employee an Admin User?</th>
                                    <td>
                                        <input
                                            type="radio"
                                            name="upempAdminf"
                                            id="upuseradminyes"
                                            value="1"
                                            checked={this.state.ghempAdminf === "1"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />Yes
                                           <input
                                            type="radio"
                                            name="upempAdminf"
                                            id="upuseradminno"
                                            value="0"
                                            checked={this.state.ghempAdminf === "0"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />No
                                        </td>
                                </tr>

                            </tbody>
                        </table>
                        <input type="hidden" name="upuserkey" id="upuserkey" onChange={this.set_value.bind(this, 'ghempKeyf')}/>
                        <input type="submit" name="thesubmit" value="Update Employee" id="thesubmit" />
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
                        size="45"/>

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
                    recKey={user.EmployeeID}
                    firstName={user.EmployeeFirstName}
                    lastName={user.EmployeeLastName}
                    admin={admin_option}
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
    getInitialState: function () {
        return {
            upfuserkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupfuserkey = this.props.recKey;
        console.log(theupfuserkey)
        this.loadSingleUser(theupfuserkey);
    },
    loadSingleUser: function (uKey) {
        $.ajax({
            url: '/getsingleemp',
            data: {
                'upempkey': uKey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);

                var populateEmp = this.state.singledata.map(function (user) {
                    upuserkey.value = uKey;
                    upuserlast.value = user.EmployeeLastName;
                    upuserfirst.value = user.EmployeeFirstName;
                    upuseremail.value = user.EmployeeEmail;
                    if (user.EmployeeAdmin == 1) {
                        upuseradminyes.checked = true;
                    } else {
                        upuseradminno.checked = true;
                    }

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
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
                    {this.props.admin}
                </td>
                <td>
                    <form onSubmit={this.updateRecord}>
                        <input type="hidden" id={this.props.recKey} name={this.props.recKey}/>
                        <input type="submit" value="Update Record" />
                    </form>
                </td>
                <td>
                    <a href="#rightBox" id="updateLink" name="updateLink">Go to Update Form</a>
                </td>
            </tr>
        );
    }
});

//Start all here by calling the varaible Loginbox
ReactDOM.render(
    <Userbox/>,
    document.getElementById('content_box')
);