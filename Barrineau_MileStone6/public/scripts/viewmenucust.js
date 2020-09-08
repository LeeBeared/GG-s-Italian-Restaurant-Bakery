var Contentbox = React.createClass({
    getInitialState: function () {
        return { data: [], mt:[]};
    },
    loadMtFromServer: function () {
        $.ajax({
            url: '/getmenuitem',
            data: {
                'mtName': "",
                'mtPrice': "",
                'mCatID': "",
                'mtAvialable': 1,
                'mtDescription': ""
            },
            dataType: 'json',
            cache: false,
            success: function (ddata) {
                this.setState({ data: ddata, mt: ddata });
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
                </center>
                <br /><br />
                <MenuList data={this.state.data} mtdata={this.state.mt} ></MenuList>
            </div>
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

        if (this.props.msName.length>0) {
            return (
                < tbody id={this.props.msName} className={"menuBox"} >
                    <tr>

                        <td colSpan="4" id={"title" + this.props.msName} name={"title" + this.props.msName} className="mtTitle"><center>{this.props.msName}</center></td>
                    </tr>
                    <tr>
                        <td >
                            <center>
                                <table width="50%" className="mtTable">
                                <thead>
                                    <th>Name</th>
                                    <th>Price</th>
                                </thead>
                                {mtNodes}
                                </table>
                            </center>
                        </td>

                    </tr>
                </tbody>
            )
        }
        return (
            <h2></h2>
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
                            </tr>
                            <tr iid="descrDetails" name="descrDetails">
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