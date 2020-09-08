var Insertbox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadODFromServer: function () {
        var statusvalue = 2;
        if (faculty_inactiveyes.checked) {
            statusvalue = 1;
        }
        if (faculty_inactiveno.checked) {
            statusvalue = 0;
        }

        $.ajax({
            url: '/getorder',
            data: {
                'empID': empName.value,
                'orderStatus': statusvalue,
                'orderType': orderTypef.value,
                'orderCharged': orderChargedf.value,
                'orderTableNumber': orderTableNumberf.value,
                'orderRoomNumber': orderRoomNumberf.value,
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
        this.loadODFromServer();
    },
    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="search_box">
                <center>
                    <h2>Search Order</h2>
                </center>
                <Insertform onOrdSumbit={this.loadODFromServer} />
                <br /><br />
                <center><OdList data={this.state.data}></OdList></center>
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
            orderStatusf: "", orderTypef: "", orderChargedf: "", orderTableNumberf: "", orderRoomNumberf: "", empdata: []
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
        this.props.onOrdSumbit({
            empID: empID,
            orderStatus: orderStatus,
            orderType: orderType,
            orderCharged: orderCharged,
            orderTableNumber: orderTableNumber,
            orderRoomNumber: orderRoomNumber,

            

        });
        this.setState({ orderStatusf: "", orderDatef: "", orderTimef: "", orderTypef: "", orderChargedf: "", orderTableNumberf: "", orderRoomNumberf: ""})

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
                                        required={false}
                                        minCharacters={3}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderTypef')}
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
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderChargedf')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Table Number</th>
                                    <td><TextInput
                                        value={this.state.orderTableNumberf}
                                        uniqueName="orderTableNumberf"
                                        text="Enter Table Number"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderTableNumberf')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Room Number</th>
                                    <td><TextInput
                                        value={this.state.orderRoomNumberf}
                                        uniqueName="orderRoomNumberf"
                                        text="Enter Room Number"
                                        textArea={false}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'orderRoomNumberf')}
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
                <option value="0" key="0">Please Select An Employee For the Order</option>
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
var OdList = React.createClass({
    render: function () {
        var mtNodes = this.props.data.map(function (od) {

            var status_option = od.OrderStatus;
            
            if (status_option == 0) { status_option = "Open"; }
            else if (status_option == 1) { status_option = "Closed"; }
            var tableRoom = false;
            var tbrmNumber = 0;
            if (od.OrderTableNumber > 0) { tableRoom = "Table"; tbrmNumber = od.OrderTableNumber; }
            else if (od.OrderRoomNumber > 0) { tableRoom = "Room"; tbrmNumber = od.OrderRoomNumber; }
          
            //map the data to individual donations
            return (

                <ODs
                    odDate={od.orderDate}
                    odDaily={od.orderDaily}
                    odCharged={od.OrderCharged}
                    odStatus={status_option}
                    odtype={od.OrderType}
                    tableRoom={tableRoom}
                    trNumber={tbrmNumber}
                    fName={od.EmployeeFirstName}
                    lName={od.EmployeeLastName}
                    odTime={od.OrderTime}
                >
                </ODs>
            );

        });

        //print all the nodes in the list
        return (
            <table name="order_table" id="order_table" className="db_output_table">
                <thead>
                    <th><h2>Date Time</h2></th>
                    <th><h2>Daily Number</h2></th>
                    <th><h2>Order Status</h2></th>
                    <th><h2>Employee</h2></th>
                    <th><h2>Type</h2></th>
                    <th><h2>Charged</h2></th>
                    <th><h2>Table or Room</h2></th>
                    <th><h2>Number</h2></th>
                </thead>
                {mtNodes}
            </table>
        );
    }
});
var ODs = React.createClass({
    render: function () {
        console.log(this.props.odDate);
        if (this.props.odDate.length > 0) { console.log("yes"); }
            return (
                <tbody>
                    <tr>

                        <td>
                           
                            {this.props.odDate} &#8194;{this.props.odTime}
                        </td>
                        <td>
                            {this.props.odDaily}
                        </td>
                        
                        <td id={this.props.odStatus} name={this.props.odStatus}>
                            {this.props.odStatus}
                        </td>
                        <td>
                            {this.props.fName}&#8194;{this.props.lName}
                        </td>
                        <td>
                            {this.props.odtype}
                        </td>

                        <td>
                            {this.props.odCharged}
                        </td>
                        <td>
                            {this.props.tableRoom}
                        </td>
                        <td>
                            {this.props.trNumber}
                        </td>
                    </tr>
                </tbody>
            );

    }
});
//Start all here by calling the varaible 
ReactDOM.render(
    <Insertbox />,
    document.getElementById('content_box')
);