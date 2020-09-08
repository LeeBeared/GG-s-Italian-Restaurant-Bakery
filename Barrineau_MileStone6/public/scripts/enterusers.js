var Insertbox = React.createClass({
    handleEmpSumbit: function (emp) {

        $.ajax({
            url: "/emp",
            dataType: "json",
            type: "POST",
            data: emp,
            success: function (data) {
                this.setState({ data: data })
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="insert_box">
                <center>
                    <h2>Insert Employee</h2>
                </center>
                <Insertform onEmpSumbit={this.handleEmpSumbit} />
            </div>
        );
    }
});
var Insertform = React.createClass({
    //Function to hand the intitial state of the 
    //form
    getInitialState: function () {

        //Return the forms's field at empty or undefined
        return {
            empLastf: "", empFirstf: "", empEmailf: "", empPasswordf: "", empAdminf: ""
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
        var empPassword = this.state.empPasswordf.trim();
        var empAdmin = this.state.empAdminf;
        var error_string = "";


        if (!empLast || !empFirst) {
            error_string += "First or Last name fields are empty please change that or enter NONE if there is no first name";
        }
        if (empPassword.length <8) { error_string +="\nEnter a Password of minmumn of 8 charcaters" }
        if (!this.validate_email(empEmail)) {
            error_string += "\nYour Email is invalid please change that";
        }

        if (empAdmin != 0 && empAdmin != 1) { error_string += "\nPlease select a admin status" }
        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.onEmpSumbit({
                empLast: empLast,
                empFirst: empFirst,
                empEmail: empEmail,
                empPassword: empPassword,
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
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'empFirstf')}
                                        errorMessage="First Name is invalid"
                                        emptyMessage="First Name is required"
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
                                        errorMessage="Last Name is invalid"
                                        emptyMessage="Last Name is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Employee Email</th>
                                    <td><TextInput
                                        value={this.state.empEmailf}
                                        uniqueName="empEmailf"
                                        text="Insert Employee Email"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.validate_email}
                                        onChange={this.set_value.bind(this, 'empEmailf')}
                                        errorMessage="Email is invalid"
                                        emptyMessage="Email is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Employee Password</th>
                                    <td><TextInput
                                        value={this.state.empPasswordf}
                                        uniqueName="empPasswordf"
                                        text="Insert Employee Password"
                                        textArea={false}
                                        required={true}
                                        minCharacters={8}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'empPasswordf')}
                                        errorMessage="Password should miminu of 8 characters"
                                        emptyMessage="Password is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Is the Employee an Admin User?</th>
                                    <td>
                                        <input
                                            type="radio"
                                            name="empAdminf"
                                            id="faculty_inactiveyes"
                                            value="1"
                                            checked={this.state.empAdminf === "1"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />Yes
                                           <input
                                            type="radio"
                                            name="empAdminf"
                                            id="faculty_inactiveno"
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
//Start all here by calling the varaible 
ReactDOM.render(
    <Insertbox />,
    document.getElementById('content_box')
);