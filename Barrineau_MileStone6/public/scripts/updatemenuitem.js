var Searchbox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadMtFromServer: function () {
        var avialablevalue = 2;
        if (mtAvialablefyes.checked) {
            avialablevalue = 1;
        }
        if (mtAvialablefno.checked) {
            avialablevalue = 0;
        }
        $.ajax({
            url: '/getmenuitem',
            data: {
                'mtName': mtNamef.value,
                'mtPrice': mtPricef.value,
                'mCatID': menuCat.value,
                'mtAvialable': avialablevalue,
                'mtDescription': mtDescriptionf.value
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
            url: '/updatemenuitem',
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
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadMtFromServer();
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="search_box">
                <center>
                    <h2>Update Menu Item</h2>
                </center>
                <div id="leftBox">   
                <Searchform onMtSumbit={this.loadMtFromServer} />
            </div>
                <div id="rightBox" name="rightBox"><MTUpdatefor uponMtSumbit={this.updateSingleMT} />
                </div>
                <br /><br />
                <center><MtList data={this.state.data} /></center>

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
            mtNamef: "", mtPricef: "", mtDescriptionf: "", mtAvialablef: "", catData: []
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

        var mCatID = menuCat.value;
        var mtName = this.state.mtNamef.trim();
        var mtPrice = this.state.mtPricef.trim();
        var mtDescription = this.state.mtDescriptionf.trim();
        var mtAvialable = this.state.mtAvialablef;
        var error_string = "";
        if (isNaN(mtPrice)) { error_string += "\nPrice should be a number"; }

        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        this.props.onMtSumbit({
            mtName: mtName,
            mtPrice: mtPrice,
            mtDescription: mtDescription,
            mtAvialable: mtAvialable,
            mCatID: mCatID
        });

        this.setState({ mtNamef: "", mtPricef: "", mtDescriptionf: "", mtAvialablef: "" })

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
                    <fieldset><legend>Menu Item Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Menu Item Name</th>
                                    <td><TextInput
                                        value={this.state.mtNamef}
                                        uniqueName="mtNamef"
                                        text="Insert Menu Item Name"
                                        textArea={false}
                                        required={false}
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
                                        required={false}
                                        minCharacters={1}
                                        validate={this.common_validate}
                                        onChange={this.set_value.bind(this, 'mtPricef')}
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
                                    <th>Is the Menu Item Available?</th>
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
                                            name="mtAvialablef"
                                            id="mtAvialablefno"
                                            value="0"
                                            checked={this.state.mtAvialablef === "0"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />No
                                        </td>
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
var MTUpdatefor = React.createClass({
    //Function to hand the intitial state of the 
    //form
    getInitialState: function () {

        //Return the forms's field at empty or undefined
        return {
            mtNamef: "", mtPricef: "", mtDescriptionf: "", umtAvialablef: "", upcatData: [], recKey:""
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
                this.setState({ upcatData: cdata });
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

        var mCatID = upmenuCat.value;
        var mtName = upName.value;
        var mtPrice = upPrice.value;
        var mtDescription = upDescr.value;
        var mtAvialable = 0;
        var recKey = upRecKey.value;
        var error_string = "";
        if (upaviableyes.checked) {
            mtAvialable = 1;

        }


        if (mCatID == 0) { error_string += "Please select a Menu Category" }
        if (!mtName) {
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
            this.props.uponMtSumbit({
                recKey:recKey,
                mtName: mtName,
                mtPrice: Number(mtPrice),
                mtDescription: mtDescription,
                mtAvialable: mtAvialable,
                mCatID: mCatID
            });
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
                    <fieldset><legend>Update Menu Item Information</legend>
                        <table border>
                            <tbody>
                                <tr>
                                    <th>Menu Item Name</th>
                                    <td><TextInput
                                        uniqueName="upName"
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
                                        uniqueName="upPrice"
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
                                        <UpCatList upcatData={this.state.upcatData} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td><TextInput
                                        uniqueName="upDescr"
                                        text="Insert Description"
                                        textArea={true}
                                        required={false}
                                        minCharacters={1}
                                        validate={this.validate_email}
                                        onChange={this.set_value.bind(this, 'mtDescriptionf')}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>Is the Menu Item Available?</th>
                                    <td>
                                        <input
                                            type="radio"
                                            name="mtAvialablef"
                                            id="upaviableyes"
                                            value="1"
                                            checked={this.state.mtAvialablef === "1"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />Yes
                                           <input
                                            type="radio"
                                            name="mtAvialablef"
                                            id="upaviableno"
                                            value="0"
                                            checked={this.state.mtAvialablef === "0"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />No
                                        </td>
                                </tr>

                            </tbody>
                        </table>
                        <input type="hidden" name="upRecKey" id="upRecKey" />
                        <input type="submit" name="thesubmit" value="Update Menu Item" id="thesubmit" />
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
                        id={this.props.uniqueName}
                        name={this.props.uniqueName}
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
var CatList = React.createClass({
    render: function () {
        var optionNodes = this.props.catData.map(function (cats) {
            return (
                <option
                    key={cats.MenuCategoryType}
                    value={cats.MenuCategoryType}
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
var UpCatList = React.createClass({
    render: function () {
        var optionNodes = this.props.upcatData.map(function (cats) {
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
            <select name="upmenuCat" id="upmenuCat">
                <option value="">Please Select A Menu Category</option>
                {optionNodes}
            </select>
        );
    }
});
var MtList = React.createClass({
    render: function () {
        var mtNodes = this.props.data.map(function (mt) {





            //map the data to individual donations
            return (

                <Mts
                    mtPrice={mt.MenuItemPrice}
                    mtName={mt.MenuItemName}
                    mtCat={mt.MenuCategoryType}
                    aviable={mt.MenuItemAvialable}
                    descr={mt.MenuItemDescription}
                    recKey={mt.MenuItemID}
                >
                </Mts>
            );

        });

        //print all the nodes in the list
        return (
            <table name="admin_table" id="admin_table" className="db_output_table">
                <thead>
                    <th><h2>Name</h2></th>
                    <th><h2>Price</h2></th>
                    <th><h2>Category</h2></th>
                    <th><h2>Available</h2></th>
                </thead>
                {mtNodes}
            </table>


        );
    }
});
var Mts = React.createClass({
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
            url: '/getsinglemt',
            data: {
                'upempkey': uKey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);

                var populateIvent = this.state.singledata.map(function (rec) {
                    upRecKey.value = rec.MenuItemID;
                    upPrice.value = rec.MenuItemPrice;
                    upName.value = rec.MenuItemName;
                    upDescr.value = rec.MenuItemDescription;
                    upmenuCat.value = rec.MenuCategoryID;
                    if (rec.MenuItemAvialable == 1) { upaviableyes.checked = true; }
                    else {
                        upaviableno.checked = true;
                    }

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    render: function () {
        var av_option = "";
        if (this.props.aviable == 1) { av_option = "Yes"; }
        else if (this.props.aviable == 0) { av_option = "No"; }

        if (this.props.descr.length > 0) {


            return (


                <tbody>
                    <tr>

                        <td>

                            {this.props.mtName}
                        </td>
                        <td>
                            {this.props.mtPrice}
                        </td>
                        <td>
                            {this.props.mtCat}
                        </td>
                        <td>
                            {av_option}
                        </td>
                        <td>
                            <form onSubmit={this.updateRecord}>

                                <input type="submit" value="Update Record" />
                            </form>
                        </td>
                        <td>
                            <a href="#rightBox" id="updateLink" name="updateLink">Go to Update Form</a>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4">
                            <table className="tableDescrpt" >
                                <tr>
                                    <center>
                                        <td>
                                            <center><h4>Descrtipon</h4></center>
                                            <p>{this.props.descr}</p>

                                        </td>
                                    </center>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </tbody>


            );
        }
        else {

            return (
                <tbody>
                    <tr>
                        <td>

                            {this.props.mtName}
                        </td>
                        <td>
                            {this.props.mtPrice}
                        </td>
                        <td>
                            {this.props.mtCat}
                        </td>
                        <td>
                            {av_option}
                        </td>
                        <td>
                            <form onSubmit={this.updateRecord}>

                                <input type="submit" value="Update Record" />
                            </form>
                        </td>
                        <td>
                            <a href="#rightBox" id="updateLink" name="updateLink">Go to Update Form</a>
                        </td>
                    </tr>
                    
                </tbody>
            );
        }
    }
});

//Start all here by calling the varaible 
ReactDOM.render(
    <Searchbox />,
    document.getElementById('content_box')
);