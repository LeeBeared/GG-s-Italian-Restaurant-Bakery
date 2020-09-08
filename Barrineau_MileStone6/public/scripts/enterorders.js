var Insertbox = React.createClass({
    getInitialState: function () {
        return {
            data: [],
        };
    },
    handleOrdSumbit: function (order) {

        $.ajax({
            url: "/order",
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
                <Insertform onOrdSumbit={this.handleOrdSumbit} />
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
            orderStatusf: "",orderTypef: "", orderChargedf: "", orderTableNumberf: "", orderRoomNumberf: "", empdata: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            orderStatusf: e.target.value
        });
    },
    loadEmps: function () {
        $.ajax({
            url: '/allemp',
            dataType: 'json',
            cache: false,
            success: function (edata) {
                this.setState({ empdata: edata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadEmps();
    },
    handle_submit: function (e) {
        //Stop the default action of the sumbit
        e.preventDefault();
        //Clean the data by trim it while saving the data
        var empID = empName.value;
        var orderStatus = this.state.orderStatusf.trim();
        var orderType = this.state.orderTypef.trim();
        var orderCharged = this.state.orderChargedf.trim();
        var orderTableNumber = this.state.orderTableNumberf.trim();
        var orderRoomNumber = this.state.orderRoomNumberf.trim();
        var error_string = "";


        if (isNaN(orderCharged)) { console.log("Charged Amount is not a Number"); }
        if (isNaN(orderTableNumber)) { console.log("Table Number is not a Number");}
        if (isNaN(orderRoomNumber)) { console.log("Room Number is not a Number"); }

        if (empID==0 ) { error_string += "\nPlease select a employee" }
        if (orderType.length == 0) { error_string += "\nPlease Enter A order type" }

        if (orderTableNumber <=0 && orderRoomNumber <=0) { error_string += "\nPlease Enter either a room number or table number that is not 0" }


        if (orderStatus != 0 && orderStatus != 1) { error_string += "\nPlease select a order status" }
        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.onOrdSumbit({
                empID: empID,
                orderStatus: orderStatus,
                orderType: orderType,
                orderCharged: Number(orderCharged),
                orderTableNumber: orderTableNumber,
                orderRoomNumber: orderRoomNumber,
            });
            this.setState({
                orderStatusf: "", orderDatef: "",
                orderTimef: "", orderTypef: "", orderChargedf: "",
                orderTableNumberf: "", orderRoomNumberf: "",
            })
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
                    <fieldset><legend>Order Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Employee </th>
                                    <td>
                                        <EmpList empdata={this.state.empdata} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Order Type</th>
                                    <td><TextInput
                                        value={this.state.orderTypef}
                                        uniqueName="orderTypef"
                                        text="Insert Order Type such as dine-in, take-out "
                                        textArea={false}
                                        required={true}
                                        minCharacters={3}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderTypef')}
                                        errorMessage="Order Type is invalid"
                                        emptyMessage="Order Type is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Order Status</th>
                                    <td>
                                        <input
                                            type="radio"
                                            name="orderStatusf"
                                            id="faculty_inactiveyes"
                                            value="1"
                                            checked={this.state.orderStatusf === "1"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />Complete
                                           <input
                                            type="radio"
                                            name="orderStatusf"
                                            id="faculty_inactiveno"
                                            value="0"
                                            checked={this.state.orderStatusf === "0"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />Open
                                        </td>
                                </tr>                                                    
                                <tr>
                                    <th>Charged Amount</th>
                                    <td><TextInput
                                        value={this.state.orderChargedf}
                                        uniqueName="orderChargedf"
                                        text="Insert Amount Charged for the order"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderChargedf')}
                                        errorMessage="Charged Amount is not a dollar amount"
                                        emptyMessage="Charged Amount is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Table Number</th>
                                    <td><TextInput
                                        value={this.state.orderTableNumberf}
                                        uniqueName="orderTableNumberf"
                                        text="Enter Table Number or 0 for when there isn't one"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderTableNumberf')}
                                        errorMessage="Table Number is not entered"
                                        emptyMessage="Table Number is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Room Number</th>
                                    <td><TextInput
                                        value={this.state.orderRoomNumberf}
                                        uniqueName="orderRoomNumberf"
                                        text="Enter Room Number or 0 for when there isn't one"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderRoomNumberf')}
                                        errorMessage="Table Number is not entered"
                                        emptyMessage="Table Number is required"
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

var EmpList = React.createClass({
    render: function () {
        var optionNodes = this.props.empdata.map(function (employee) {
            return (
                <option
                    key={employee.EmployeeID}
                    value={employee.EmployeeID}
                >
                    {employee.EmployeeFirstName} {employee.EmployeeLastName}
                </option>
            );
        });
        return (
            <select name="empName" id="empName">
                <option value="">Please Select An Employee For the Order</option>
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