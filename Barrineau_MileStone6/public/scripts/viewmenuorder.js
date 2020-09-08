var Contentbox = React.createClass({
    getInitialState: function () {
        return { data: [], mtdata:[] };
    },
    loadCats: function () {
        $.ajax({
            url: '/allmenucat',
            dataType: 'json',
            cache: false,
            success: function (cdata) {
                console.log(cdata);
                this.setState({ data: cdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
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
                this.setState({ mtdata: ddata });
                console.log(this.props.mtdata);
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(this.props.mtdata);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadCats(); this.loadMtFromServer();
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div className="menuBox">
                <center>
                    <h2>Menu</h2>
                    <NavList data={this.state.data}></NavList>
                </center>
                <br /><br />
                <MenuList data={this.state.data} mtdata={this.state.mtdata} ></MenuList>
            </div>
        );
    }
});

var NavList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (menucat) {
            return (
                <a
                    href={"#" + menucat.MenuCategoryType}
                    className={"menuNav"}
                >
                    {menucat.MenuCategoryType+ "  "}
                </a>
            );
        });
        return (
            <nav name="menuNav" id="menuNav">
                {optionNodes}
            </nav>
        );
    }

});


var MenuList = React.createClass({
    render: function () {
        var mtdataf = this.props.mtdata;
        var optionNodes = this.props.data.map(function (menucat) {
            return (
                <MenuSection
                    msName={menucat.MenuCategoryType}
                    msKey={menucat.MenuCategoryID}
                    mtdata={mtdataf}
                >
                </MenuSection>
            );
        });
        return (
            <section name="menuNav" id="menuNav">
                {optionNodes}
            </section>
        );
    }
});
var MenuSection = React.createClass({

    render: function () {
        
        var msKey = this.props.msKey;
        var mtNodes = this.props.mtdata.map(function (od) {
            //map the data to individual donations
            return (

                <Mts
                    mtName={od.MenuItemName}
                    mtPrice={od.MenuItemPrice}
                    mtDescr={od.MenuItemDescription}
                    mtCat={od.MenuCategoryID}
                    catId={msKey}
                >
                </Mts>
            );

        });
        return (
            < div id={this.props.msName} className={"menuBox"} >
                <center>
                    <h2 id={"title" + this.props.msName} name={"title" + this.props.msName}>{this.props.msName}</h2>
                    {mtNodes}
                </center>
            </div>
            )
    }

});

var Mts = React.createClass({
    render: function () {
        if (this.props.mtCat == this.props.catId) {
            return (
                <p>
                    {this.props.mtName}  {this.props.mtPrice}  <br></br>{ this.props.mtDescr}
                </p>
            );
        }
        else {
            return (<p></p>
            );
        }
            

    }
});



//Start all here by calling the varaible Loginbox
ReactDOM.render(
    <Contentbox/>,
    document.getElementById('content_box')
);