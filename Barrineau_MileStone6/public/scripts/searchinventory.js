var Insertbox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadIvtFromServer: function () {

        $.ajax({
            url: '/getinvent',
            data: {
                'inventName': inventNamef.value,
                'inventPrice':  inventPricef.value,
                'inventQuantity': inventQuantityf.value
            },
            dataType: 'json',
            cache: false,
            success: function (ddata) {
                this.setState({ data: ddata });
            }.bind(this),
            error: function (xhr, status, err) {

                console.log(this.props.data);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadIvtFromServer();
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="insert_box">
                <center>
                    <h2>Search Inventory</h2>
                </center>
                <Searchform onInventSumbit={this.loadIvtFromServer} />
                <br /><br />
                <center>
                <table name="invent_table" id="invent_table" className="db_output_table">
                    <thead>
                        <th><h2>Name</h2></th>
                        <th><h2>Price</h2></th>
                        <th><h2>Quantity</h2></th>
                    </thead>
                    <InventoryList data={this.state.data} />
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
            inventNamef: "", inventQuantityf: "", inventPricef: ""
        };
    },
    handle_submit: function (e) {
        //Stop the default action of the sumbit
        e.preventDefault();
        //Clean the data by trim it while saving the data
        var inventName = this.state.inventNamef.trim();
        var inventPrice = this.state.inventPricef.trim();
        var inventQuantity = this.state.inventQuantityf.trim();
        var error_string = "";


        if (isNaN(inventQuantity)) { error_string += "\n Quantity should be a number"; }
        if (isNaN(inventPrice)) { error_string += "\n Price should be a number" }


        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }

        this.props.onInventSumbit({
            inventName: inventName,
            inventPrice: inventPrice,
            inventQuantity: inventQuantity
        });
        this.setState({ inventNamef: "", inventPricef: "", inventQuantityf: "" })

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
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'inventNamef')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Inventory Price</th>
                                    <td><TextInput
                                        value={this.state.inventPricef}
                                        uniqueName="inventPricef"
                                        text="Insert Inventory Price"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'inventPricef')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Inventory Quantity</th>
                                    <td><TextInput
                                        value={this.state.inventQuantityf}
                                        uniqueName="inventQuantityf"
                                        text="Insert Inventory Quantity"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'inventQuantityf')}
                                    /></td>
                                </tr>
                            </tbody>
                        </table>
                        <input type="submit" name="thesubmit" value="Search" id="thesubmit" />
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
var InventoryList = React.createClass({
    render: function () {
        var InventNodes = this.props.data.map(function (invent) {
            //map the data to individual donations
            return (
                <Invents
                    inName={invent.InventoryName}
                    inPrice={invent.InventoryPrice}
                    inQuantity={invent.InventoryQuantity}
                >
                </Invents>
            );

        });

        //print all the nodes in the list
        return (
            <tbody>
                {InventNodes}
            </tbody>
        );
    }
});
var Invents = React.createClass({

    render: function () {
        return (

            <tr>
                <td>

                    {this.props.inName}
                </td> 

                <td>
                    {this.props.inPrice}
                </td>

                <td>
                    {this.props.inQuantity}
                </td>
            </tr>
        );
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