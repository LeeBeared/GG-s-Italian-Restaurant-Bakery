var Insertbox = React.createClass({
    handleInventSumbit: function (invent) {

        $.ajax({
            url: "/invent",
            dataType: "json",
            type: "POST",
            data: invent,
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
                    <h2>Insert Inventory</h2>
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
            inventNamef: "", inventQuantityf: "", inventPricef: ""
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
        var inventName = this.state.inventNamef.trim();
        var inventPrice = this.state.inventPricef.trim();
        var inventQuantity = this.state.inventQuantityf.trim();
        var error_string = "";


        if (!inventName ) {
            error_string += "\nThere should be a Name for the inventory item";
        }
        if (isNaN(inventQuantity)) { error_string += "\n Quantity should be a number"; }
        if (isNaN(inventPrice)) { error_string += "\n Price should be a number" }


        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.onInventSumbit({
                inventName: inventName,
                inventPrice: Number(inventPrice),
                inventQuantity: Number(inventQuantity)
            });
            this.setState({ inventNamef: "", inventPricef: "", inventQuantityf: "" })
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
                    <fieldset><legend>Inventory Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Inventory Name</th>
                                    <td><TextInput
                                        value={this.state.inventNamef}
                                        uniqueName="inventNamef"
                                        text="Insert Inventory Name"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'inventNamef')}
                                        errorMessage="Name is invalid"
                                        emptyMessage="Name is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Inventory Price</th>
                                    <td><TextInput
                                        value={this.state.inventPricef}
                                        uniqueName="inventPricef"
                                        text="Insert Inventory Price"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'inventPricef')}
                                        errorMessage="Price is invalid"
                                        emptyMessage="Price is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Inventory Quantity</th>
                                    <td><TextInput
                                        value={this.state.inventQuantityf}
                                        uniqueName="inventQuantityf"
                                        text="Insert Inventory Quantity"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.validateDollars}
                                        onChange={this.set_value.bind(this, 'inventQuantityf')}
                                        errorMessage="Quantity is invalid"
                                        emptyMessage="Quantity is required"
                                    /></td>
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