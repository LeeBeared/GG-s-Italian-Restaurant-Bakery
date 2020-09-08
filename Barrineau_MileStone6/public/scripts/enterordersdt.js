var Insertbox = React.createClass({
    handleOrddSumbit: function (order) {

        $.ajax({
            url: "/orderdt",
            dataType: "json",
            type: "POST",
            data: order,
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
                    <h2>Insert Order</h2>
                </center>
                <Insertform onOrdSumbit={this.handleOrddSumbit} />
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
            orderdata: [], menuItemdara: [], orderQuanity: "" 
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            orderStatusf: e.target.value
        });
    },
    loadOrd: function () {
        $.ajax({
            url: '/allorder',
            dataType: 'json',
            cache: false,
            success: function (edata) {
                this.setState({ orderdata: edata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadMT: function () {
        $.ajax({
            url: '/allmenuitem',
            dataType: 'json',
            cache: false,
            success: function (mtdata) {
                this.setState({ menuItemdara: mtdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadOrd();
        this.loadMT()
    },
    handle_submit: function (e) {
        //Stop the default action of the sumbit
        e.preventDefault();
        //Clean the data by trim it while saving the data
        var menuItemID = mtselect.value;
        var orderID = ordID.value;
        var orderQuanity = this.state.orderQuanity.trim();
        var error_string = "";


        if (isNaN(orderQuanity)) { console.log("\nQuanity is not a Number"); }

        if (menuItemID==0 ) { error_string += "\nPlease select a menu item" }
        if (orderID == 0) { error_string += "\nPlease select a daily order" }

        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.onOrdSumbit({
                orderQuanity: Number(orderQuanity),
                menuItemID: menuItemID,
                orderID: orderID,
            });
            this.setState({orderQuanity: "" }) }
        

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
                    <fieldset><legend>Order Detail Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Order Number </th>
                                    <td>
                                        <OrdList orderdata={this.state.orderdata} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Menu Item </th>
                                    <td>
                                        <MTList menuItemdara={this.state.menuItemdara} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Menu Item Quantity</th>
                                    <td><TextInput
                                        value={this.state.orderQuanity}
                                        uniqueName="orderQuanity"
                                        text="How Many of the same menu items the customer order"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderQuanity')}
                                        errorMessage="Quantity is not entered"
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

var OrdList = React.createClass({
    render: function () {
        var optionNodes = this.props.orderdata.map(function (order) {
            return (
                <option
                    key={order.OrderID}
                    value={order.OrderID}
                >
                    Order Number: {order.orderDaily}
                </option>
            );
        });
        return (
            <select name="ordID" id="ordID">
                <option value="">Please Select An Order</option>
                {optionNodes}
            </select>
        );
    }
});
var MTList = React.createClass({
    render: function () {
        var optionNodes = this.props.menuItemdara.map(function (mt) {
            return (
                <option
                    key={mt.MenuItemID}
                    value={mt.MenuItemID}
                >
                    {mt.MenuItemName}
                </option>
            );
        });
        return (
            <select name="mtselect" id="mtselect">
                <option value="">Please Select An Menu Item</option>
                {optionNodes}
            </select>
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