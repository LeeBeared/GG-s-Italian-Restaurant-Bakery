var Insertbox = React.createClass({
    handleMTSumbit: function (mt) {

        $.ajax({
            url: "/menuitem",
            dataType: "json",
            type: "POST",
            data: mt,
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
                    <h2>Insert Menu Item</h2>
                </center>
                <Insertform onMtSumbit={this.handleMTSumbit} />
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
            mtNamef: "", mtPricef: "", mtDescriptionf: "", mtAvialablef: "", catData:[]
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            mtAvialablef: e.target.value
        });
    },
    loadCats: function () {
        $.ajax({
            url: '/allmenucat',
            dataType: 'json',
            cache: false,
            success: function (cdata) {
                this.setState({ catData: cdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCats();
    },
    handle_submit: function (e) {
        //Stop the default action of the sumbit
        e.preventDefault();
        //Clean the data by trim it while saving the data

        var mCatID=menuCat.value;
        var mtName = this.state.mtNamef.trim();
        var mtPrice = this.state.mtPricef.trim();
        var mtDescription = this.state.mtDescriptionf.trim();
        var mtAvialable = this.state.mtAvialablef;
        var error_string = "";

        if (mCatID == 0) { error_string += "Please select a Menu Category"}
        if (!mtName ) {
            error_string += "\nThere should a name for the menu item";
        }
        if (mtName.length == 0) { error_string += "\nMenu Item should have a name" }

        if (mtAvialable != 0 && mtAvialable != 1) { error_string += "\nPlease select a avaiable status" }
        if (isNaN(mtPrice)) { error_string += "\nPrice should be a number"; }

        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        else {
            this.props.onMtSumbit({
                mtName: mtName,
                mtPrice: Number(mtPrice),
                mtDescription: mtDescription,
                mtAvialable: mtAvialable,
                mCatID: mCatID
            });
            this.setState({ mtNamef: "", mtPricef: "", mtDescriptionf: "", mtAvialablef: ""}) }

        

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
                                    <th>Menu Item Name</th>
                                    <td><TextInput
                                        value={this.state.mtNamef}
                                        uniqueName="mtNamef"
                                        text="Insert Menu Item Name"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'mtNamef')}
                                        errorMessage="Name is invalid"
                                        emptyMessage="Name is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Menu Item Price</th>
                                    <td><TextInput
                                        value={this.state.mtPricef}
                                        uniqueName="mtPricef"
                                        text="Insert Menu Item Price"
                                        textArea={false}
                                        required={true}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'mtPricef')}
                                        errorMessage="Price is invalid"
                                        emptyMessage="Price is required"
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Menu Category </th>
                                    <td>
                                        <CatList catData={this.state.catData} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td><TextInput
                                        value={this.state.mtDescriptionf}
                                        uniqueName="mtDescriptionf"
                                        text="Insert Description"
                                        textArea={true}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.validate_email}
                                        onChange={this.set_value.bind(this, 'mtDescriptionf')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Is the Menu Item Avaiable?</th>
                                    <td>
                                        <input
                                            type="radio"
                                            name="mtAvialablef"
                                            id="mtAvialablefyes"
                                            value="1"
                                            checked={this.state.mtAvialablef === "1"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />Yes
                                           <input
                                            type="radio"
                                            name="empAdminf"
                                            id="fmtAvialablefno"
                                            value="0"
                                            checked={this.state.mtAvialablef === "0"}
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
var CatList = React.createClass({
    render: function () {
        var optionNodes = this.props.catData.map(function (cats) {
            return (
                <option
                    key={cats.MenuCategoryID}
                    value={cats.MenuCategoryID}
                >
                    {cats.MenuCategoryType}
                </option>
            );
        });
        return (
            <select name="menuCat" id="menuCat">
                <option value="">Please Select A Menu Category</option>
                {optionNodes}
            </select>
        );
    }
});
//Start all here by calling the varaible 
ReactDOM.render(
    <Insertbox />,
    document.getElementById('content_box')
);