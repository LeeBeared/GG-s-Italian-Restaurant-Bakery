var Insertbox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadIvtFromServer: function () {

        $.ajax({
            url: '/getinvent',
            data: {
                'inventName': "",
                'inventPrice': "",
                'inventQuantity': ""
            },
            dataType: 'json',
            cache: false,
            success: function (ddata) {
                console.log(ddata)
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
                    <h2> Inventory Levels</h2>
                    <nav id="reportNav"><a href="#Total" >Go to Totals</a></nav>
                </center>
                <center>
                    <InventoryList data={this.state.data} />
                </center>
            </div>
        );
    }
});
var InventoryList = React.createClass({
    render: function () {
        InventMax = this.props.data.length;
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
            <table name="invent_table" id="invent_table" className="db_output_table">
                <thead>
                    <th colSpan="2"><h2>Name</h2></th>
                    <th><h2>Price</h2></th>
                    <th><h2>Quantity</h2></th>
                </thead>
                {InventNodes}
            </table>
            
                
            
        );
    }
});
var Invents = React.createClass({

    render: function () {
        CurrentInvent += 1;
        Quanittotal += Number(this.props.inQuantity);
        Totalinvent += Number(this.props.inPrice);

        if (CurrentInvent == InventMax) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="2">

                            {this.props.inName}
                        </td>

                        <td>
                            {this.props.inPrice}
                        </td>

                        <td>
                            {this.props.inQuantity}
                        </td>
                    </tr>                
                    <tr id="TotalRow">
                        <td id="Total">Totals</td>
                        <td>{InventMax}</td>
                        <td>	&#36;{Totalinvent}</td>
                        <td>{Quanittotal}</td>
                     </tr>
                </tbody>
            );
        }
        else

        {
            return (
                <tbody>
                    <tr>
                        <td colSpan="2">

                            {this.props.inName}
                        </td>

                        <td>
                            {this.props.inPrice}
                        </td>

                        <td>
                            {this.props.inQuantity}
                        </td>
                    </tr>
                </tbody>
            );}
        
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

var CurrentInvent = 0;
var InventMax = 0;
var Quanittotal = 0;
var Totalinvent = 0;