var Contentbox = React.createClass({
    getInitialState: function () {
        return { data: []};
    },
    loadCats: function () {
        $.ajax({
            url: '/gethours',
            dataType: 'json',
            cache: false,
            success: function (cdata) {
                console.log(cdata);
                this.setState({ data: cdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCats();
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div id="hours" name="hours">
                <MenuList data={this.state.data}></MenuList>
            </div>
        );
    }
});
var MenuList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (menucat) {
            return (
                <MenuSection
                    End={menucat.OpsHoursEnd}
                    Start={menucat.OpsHoursStart}
                    Type={menucat.OpsHoursType}
                >
                </MenuSection>
            );
        });
        return (
            <section name="menuNav" id="menuNav">
                <p>Current Hours of Operation</p><p> Open 7 Days a Week</p>
                {optionNodes}
            </section>
        );
    }
});
var textType = "";
var MenuSection = React.createClass({
    render: function () {

        if (textType != this.props.Type) {
            textType = this.props.Type
            return (
                < div>
                    <center>
                        <p>{this.props.Type}: {this.props.Start}-{this.props.End}
                        </p>
                    </center>
                </div>
            )
        }
        else {
            return (
                < div></div>)
        }
    }

});




var Insertbox = React.createClass({
    handleInventSumbit: function (invent) {

        $.ajax({
            url: "/hours",
            dataType: "json",
            type: "POST",
            data: invent,
            success: function (data) {
                this.setState({ data: data })
                location.reload();
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
                    <Contentbox />
                    <h2> Operation Hours</h2>
                </center>
                <Insertform onInventSumbit={this.handleInventSumbit} />
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
            opsType: "", opsStart: "", opsEnd: ""
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
        var hoursType = this.state.opsType.trim();
        var opsStart = this.state.opsStart.trim();
        var opsEnd = this.state.opsEnd.trim();
        var error_string = "";


        console.log(hoursType, opsStart, opsEnd);
        if (!opsStart ) {
            error_string += "\nThere should be a start time for the Operation";
        }
        if (!opsEnd) {
            error_string += "\nThere should be a end time for the Operation";
        }
        if (hoursType=="") {
            error_string += "\n Please select an option"
        }

        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.onInventSumbit({
                hoursType: hoursType,
                opsStart: opsStart,
                opsEnd: opsEnd
            });
            window.location.reload(false);
        }
        

    },
    //Function validate the email field's input
    validate_email: function (value) {
        // regex expression
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
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
                    <fieldset><legend>Operation Hours Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Hours Type ie Lunch or Dinner</th>
                                    <td><select id="hoursType" name="hoursType" onChange={this.set_value.bind(this, 'opsType')}>
                                        <option value="">Please select an Hours Type </option>
                                        <option key="Breakfast " value="Breakfast">Breakfeast</option>
                                        <option key="Lunch" value="Lunch">Lunch</option>
                                        <option key="Dinner" value="Dinner">Dinner</option>
                                    </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Start Time</th>
                                    <td><input type="time" onChange={this.set_value.bind(this, 'opsStart')}/></td>
                                </tr>
                                <tr>
                                    <th>End Time</th>
                                    <td><input type="time" onChange={this.set_value.bind(this, 'opsEnd')} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <input type="submit" name="thesubmit" value="Update" id="thesubmit" />
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