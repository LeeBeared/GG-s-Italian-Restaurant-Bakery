var Contentbox = React.createClass({
    getInitialState: function () {
        return { data: [], mt:[]};
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
                'mtName': "",
                'mtPrice': "",
                'mCatID': menuCat.value,
                'mtAvialable': avialablevalue,
                'mtDescription': ""
            },
            dataType: 'json',
            cache: false,
            success: function (ddata) {
                this.setState({ data: ddata, mt: ddata });
                MenuNames = [];
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },

    componentDidMount: function () {
        this.loadMtFromServer(); 
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="menuBoxdiv">
                <center>
                    <h2>Our Menu</h2>
                    <Searchform onMtSumbit={this.loadMtFromServer}/>
                </center>
                <br /><br />
                <MenuList data={this.state.data} mtdata={this.state.mt} ></MenuList>
            </div>
        );
    }
});

var Searchform = React.createClass({
    //Function to hand the intitial state of the 
    //form
    getInitialState: function () {

        //Return the forms's field at empty or undefined
        return { mtAvialablef: "", catData: []
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
        var mtAvialable = this.state.mtAvialablef;
        var error_string = "";

        if (error_string.length > 0) {
            console.log(error_string);
            return;
        }
        this.props.onMtSumbit({
            mtAvialable: mtAvialable,
            mCatID: mCatID
        });

        this.setState({ mtAvialablef: "" })

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
                                    <th>Menu Category </th>
                                    <td>
                                        <CatList catData={this.state.catData} />
                                    </td>
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
var MenuNames = [];

var MenuList = React.createClass({
    render: function () {
        var mtdataf = this.props.mtdata;
        if (this.props.data.length > 0) {


            var optionNodes = this.props.data.map(function (menucat) {
                if (MenuNames.includes(menucat.MenuCategoryType)==false) {
                    MenuNames.push(menucat.MenuCategoryType)
                    
                    return (
                        <MenuSection
                            msName={menucat.MenuCategoryType}
                            msKey={menucat.MenuCategoryID}
                            mtdata={mtdataf}
                        >
                        </MenuSection>
                    );

                }
                else {
                    return (
                        <tbody></tbody>);
                }
                
              
            });
            return (
                <center>
                    <table className=" db_output_table">
                        {optionNodes}
                    </table>
                </center>
            );





        }
        else {
            return (
               <center> <h2>There are no menu items with that slection</h2></center>
                )
        }
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
var MenuSection = React.createClass({

    render: function () {
        
        var msKey = this.props.msKey;
        var mtNodes = this.props.mtdata.map(function (dfod) {
            var aviable = "Yes";

            if (dfod.MenuItemAvialable == 0) { aviable="No";}
            //map the data to individual donations
            return (

                <Mts
                    mtName={dfod.MenuItemName}
                    mtPrice={dfod.MenuItemPrice}
                    mtDescr={dfod.MenuItemDescription}
                    mtCat={dfod.MenuCategoryID}
                    catId={msKey}
                    MenuItemAvialable={aviable}
                >
                </Mts>
            );

        });

            return (
                < tbody id={this.props.msName} className={"menuBox"} >
                    <tr>

                        <td colSpan="4" id={"title" + this.props.msName} name={"title" + this.props.msName} className="mtTitle">
                            {this.props.msName}

                        </td>
                    </tr>
                    <tr>
                        <td >
                            <center>
                                <table width="50%" className="mtTable">
                                <thead>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Aviablity</th>
                                </thead>
                                {mtNodes}
                                </table>
                            </center>
                        </td>

                    </tr>
                </tbody>
            )
        }
    

});

var Mts = React.createClass({
    render: function () {
        if (this.props.mtCat == this.props.catId) {

            if (this.props.MenuItemAvialable == "No") {
                if (this.props.mtDescr.length > 0) {
                    return (
                        <tbody>

                            <tr className="menuItems">
                                <td >
                                    {this.props.mtName}
                                </td>
                                <td>
                                    {this.props.mtPrice}
                                </td>
                                <td id="Open">
                                    {this.props.MenuItemAvialable}
                                </td>
>
                            </tr>
                            <tr id="descrDetails" name="descrDetails">
                                <td colSpan="4">
                                    <table width="100%">
                                        <tr><th colSpan="3" width="100%">Descrtpion</th></tr>
                                        <tr>
                                            <td>{this.props.mtDescr}</td>
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

                            <tr className="menuItems">
                                <td >
                                    {this.props.mtName}
                                </td>
                                <td>
                                    {this.props.mtPrice}
                                </td>
                                <td id="Open">
                                    {this.props.MenuItemAvialable}
                                </td>
                            </tr>
                        </tbody>
                    );
                }


            }
            else {

                if (this.props.mtDescr.length > 0) {
                    return (

                        <tbody>

                            <tr className="menuItems">
                                <td>
                                    {this.props.mtName}
                                </td>
                                <td>
                                    {this.props.mtPrice}
                                </td>
                                <td id="Closed">
                                    {this.props.MenuItemAvialable}
                                </td>
                            </tr>
                            <tr id="descrDetails" name="descrDetails">
                                <td>
                                    <table>
                                        <tr><th>Descrtpion</th></tr>
                                        <tr>
                                            <td>{this.props.mtDescr}</td>
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

                            <tr className="menuItems">
                                <td>
                                    {this.props.mtName}
                                </td>
                                <td>
                                    {this.props.mtPrice}
                                </td>
                                <td id="Closed">
                                    {this.props.MenuItemAvialable}
                                </td>
                            </tr>
                        </tbody>
                    );
                }
            }
          
        }

        else {
            return (<tbody></tbody>
            );
        }
            

    }
});



//Start all here by calling the varaible Loginbox
ReactDOM.render(
    <Contentbox/>,
    document.getElementById('content_box')
);