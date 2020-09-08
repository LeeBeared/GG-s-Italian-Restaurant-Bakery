var Insertbox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadOdFromServer: function () {

        $.ajax({
            url: '/getorderdt',
            data: {
                'orderID': ordID.value,
                'menuItemID': mtselect.value,
                'orderQuanity': orderQuanity.value
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
    updateSingleMT: function (rec) {

        $.ajax({
            url: '/updateorderds',
            dataType: 'json',
            data: rec,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
                window.location.reload();
            }.bind(this),
            error: function (xhr, status, err) {
                window.location.reload();
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadOdFromServer();
    },
    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="search_box">
                <center>
                    <h2>Update Order Detail</h2>
                </center>
                <div id="leftBox">
                    <Searchform onOrdSumbit={this.loadOdFromServer} />
                </div>
                <div id="rightBox" name="rightBox"><UpForm uponOrdSumbit={this.updateSingleMT} />
                </div>
                <center>
                    <table name="admin_table" id="admin_table" className="db_output_table">
                        <thead>
                            <th><h2>Order Number</h2></th>
                            <th><h2>Status</h2></th>
                            <th><h2>Menu Item</h2></th>
                            <th><h2>Quanity</h2></th>
                        </thead>
                        <OdList data={this.state.data}></OdList>
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


        if (isNaN(orderQuanity)) { console.log("Quanity is not a Number"); }


        console.log(error_string);
        this.props.onOrdSumbit({
            orderQuanity: orderQuanity,
            menuItemID: menuItemID,
            orderID: orderID,
        });
        this.setState({orderQuanity: "" })

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
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderQuanity')}
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

var OrdList = React.createClass({
    render: function () {
        var optionNodes = this.props.orderdata.map(function (order) {
            return (
                <option
                    key={order.orderDaily}
                    value={order.orderDaily}
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
                    key={mt.MenuItemName}
                    value={mt.MenuItemName}
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
var OdList = React.createClass({
    render: function () {
        var odNodes = this.props.data.map(function (od) {

            var odStatus = "Open";
            if (od.orderStatus === 1) { odStatus = "Closed";}


            //map the data to individual donations
            return (

                <Ods
                    mtName={od.MenuItemName}
                    odDaily={od.orderDaily}
                    odQuanity={od.OrderDetailQuantity}
                    orStatus={odStatus}
                    recKey={od.OrderDetailID}
                >
                </Ods>
            );

        });

        //print all the nodes in the list
        return (

            <tbody>
                {odNodes}
            </tbody>
        );
    }
});
var Ods = React.createClass({
    getInitialState: function () {
        return {
            upmtkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var upmtkey = this.props.recKey;

        this.loadSingleincentr(upmtkey);
    },
    loadSingleincentr: function (uKey) {
        $.ajax({
            url: '/getsingleordert',
            data: {
                'upempkey': uKey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);

                var populateIvent = this.state.singledata.map(function (rec) {
                    upRecKey.value = rec.OrderDetailID;
                    upordID.value = rec.OrderID;
                    upmtselect.value = rec.MenuItemID;
                    uporderQuanity.value = rec.OrderDetailQuantity;

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
                    {this.props.odDaily}
                </td>
                <td className={this.props.orStatus}>

                    {this.props.orStatus}
                </td>
                <td>

                    {this.props.mtName}
                </td>
                
                <td>
                    {this.props.odQuanity}
                </td>
                <td>
                    <form onSubmit={this.updateRecord}>

                        <input type="submit" value="Update Record" />
                    </form>
                </td>
                <td><a href="#rightBox" id="updateLink" name="updateLink">Go to Update Form</a>
                </td>
            </tr>

        );
    }
})
var UpForm = React.createClass({



    //Function to hand the intitial state of the 
    //form
    getInitialState: function () {

        //Return the forms's field at empty or undefined
        return {
            uporderdata: [], upmenuItemdara: [], uporderQuanity: ""
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
                this.setState({ uporderdata: edata });
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
                this.setState({ upmenuItemdara: mtdata });
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
        var menuItemID = upmtselect.value;
        var orderID = upordID.value;
        var orderQuanity = uporderQuanity.value;
        var recKey = upRecKey.value;
        var error_string = "";


        if (isNaN(orderQuanity)) { console.log("\nQuanity is not a Number"); }

        if (menuItemID == 0) { error_string += "\nPlease select a menu item" }
        if (orderID == 0) { error_string += "\nPlease select a daily order" }

        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.uponOrdSumbit({
                recKey: recKey,
                orderQuanity: Number(orderQuanity),
                menuItemID: menuItemID,
                orderID: orderID,
            });
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
                    <fieldset><legend>Update Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Order Number </th>
                                    <td>
                                        <OrdListup orderdata={this.state.uporderdata} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Menu Item </th>
                                    <td>
                                        <MTListup menuItemdara={this.state.upmenuItemdara} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Menu Item Quantity</th>
                                    <td><TextInput
                                        uniqueName="uporderQuanity"
                                        text="How Many of the same menu items the customer order"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'uporderQuanity')}
                                        errorMessage="Quantity is not entered"
                                        emptyMessage="Quantity is required"
                                    /></td>
                                </tr>


                            </tbody>
                        </table>
                        <input type="hidden" name="upRecKey" id="upRecKey"/>
                        <input type="submit" name="thesubmit" value="Update " id="thesubmit" />
                    </fieldset>
                </form>
            </center>
        );
    }
});

var OrdListup = React.createClass({
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
            <select name="upordID" id="upordID">
                <option value="">Please Select An Order</option>
                {optionNodes}
            </select>
        );
    }
});
var MTListup = React.createClass({
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
            <select name="upmtselect" id="upmtselect">
                <option value="">Please Select An Menu Item</option>
                {optionNodes}
            </select>
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