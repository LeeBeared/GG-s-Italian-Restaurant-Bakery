
var Loginbox = React.createClass({

    handlelogSumbit: function (log) {

        $.ajax({
            url: "/login/",
            dataType: "json",
            type: "POST",
            data: log,
            success: function (data) {
                this.setState({ data: data })
                if (typeof data.redirect == 'string') {
                    window.location.href = data.redirect;
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    //Function to render out the Loginbox
    render: function () {
        //Return the html code of the Loginbox
        return (
            <div className="login_box">
                <center>
                    <h2>Login Confirmation</h2>
                    <p>You are not logged in.  Please log in</p>
                </center>
                <Loginform onEmpSumbit={this.handlelogSumbit}/>
            </div>
        );
    }
});
var Loginform = React.createClass({
    //Function to hand the intitial state of the 
    //form
    getInitialState: function () {

        //Return the forms's field at empty or undefined
        return {
            username: "", password: ""
        };
    },
    handle_login_submit: function (e) {
        //Stop the default action of the sumbit
        e.preventDefault();
        //Clean the data by trim it while saving the data
        var username = this.state.username.trim();
        var password = this.state.password.trim();
        if (password.length < 6 || username.length < 6) {
            return;
        }

        this.props.onEmpSumbit({
            username: username,
            password: password

        })
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
                <form className="Loginform" name="theform" id="theform" onSubmit={this.handle_login_submit}>
                    <table border>
                        <TextInput
                            value={this.state.username}
                            uniqueName="username"
                            text="Email"
                            textArea={false}
                            required={true}
                            minCharacters={6}
                            validate={this.common_validate}
                            onChange={this.set_value.bind(this, 'username')}
                            errorMessage="Username is invalid"
                            emptyMessage="Username is required" />
                        <TextInput
                            value={this.state.password}
                            uniqueName="password"
                            text="Password"
                            textArea={false}
                            required={true}
                            minCharacters={6}
                            validate={this.common_validate}
                            onChange={this.set_value.bind(this, 'password')}
                            errorMessage="Password is invalid"
                            emptyMessage="Password is required" />
                    </table>

                    <input type="submit" name="thesubmit" value="Login" id="thesubmit" />
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
//Start all here by calling the varaible Loginbox
ReactDOM.render(
    <Loginbox/>,
    document.getElementById('content_box')
);