var Contentbox = React.createClass({
    getInitialState: function () {
        return { data: [], mtdata:[] };
    },
    loadCats: function () {
        $.ajax({
            url: '/gethours',
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
    componentDidMount: function () {
        this.loadCats();
    },

    //Function to render out the Insertbox
    render: function () {
        //Return the html code of the Insertbox
        return (
            <div id="hours" name="hours">
                <MenuList data={this.state.data}></MenuList>
            </div>
        );
    }
});
var MenuList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (menucat) {
            return (
                <MenuSection
                    End={menucat.OpsHoursEnd}
                    Start={menucat.OpsHoursStart}
                    Type={menucat.OpsHoursType}
                >
                </MenuSection>
            );
        });
        return (
            <section name="menuNav" id="menuNav">
                <p>Hours of Operation</p><p> Open 7 Days a Week</p>
                {optionNodes}
            </section>
        );
    }
});
var textType = "";
var MenuSection = React.createClass({
    render: function () {

        if (textType != this.props.Type) {
            textType = this.props.Type
            return (
                < div>
                    <center>
                        <p>{this.props.Type}: {this.props.Start}-{this.props.End}
                        </p>
                    </center>
                </div>
            )
        }
        else {
            return (
                < div></div>)
        }
    }

});


//Start all here by calling the varaible Loginbox
ReactDOM.render(
    <Contentbox/>,
    document.getElementById('content_box')
);