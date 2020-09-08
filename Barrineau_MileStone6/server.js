'use strict';
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var bcrypt = require('bcrypt');

const mysql = require("mysql2");
const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "lbarinea_Cap",
    password: "CAPSTONE",
    database: "lbarinea_Capstone264Hotel"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("port", (process.env.Port || 3000));
app.use("/", express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/webpages/aboutus.html"));
});
app.listen(app.get("port"), function () {
    console.log("Server started: http://localhost:" + app.get("port") + "/");
});
app.post('/login/', function (req, res) {

    var empEmail = req.body.username;
    var empPw = req.body.password;


    var sqlsel = 'select * from Employee where EmployeeEmail = ?';

    var inserts = [empEmail];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (data.length > 0) {
            bcrypt.compare(empPw, data[0].EmployeePassword, function (err, passwordCorrect) {
                if (err) {
                    throw err
                } else if (!passwordCorrect) {
                    console.log("Password incorrect")
                    res.send({ passerr: "Password incorrect" })

                } else {
                    res.send({
                        redirect: '../webpages/vieworders.html' });
                }
            })
        } else {
            console.log("Incorrect user name or password");
        }


    });
});
app.post("/emp", function (req, res) {

    var empLast = req.body.empLast;
    var empFirst = req.body.empFirst;
    var empEmail = req.body.empEmail;
    var empPassword = req.body.empPassword;
    var empAdmin = req.body.empAdmin;

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(empPassword, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log("Bad");
            return
        } else {
            theHashedPW = hashedPassword;
            var sqlins = "INSERT INTO Employee (EmployeeLastName,EmployeeFirstName,EmployeeEmail,"
                + "EmployeePassword,EmployeeAdmin) VALUES (?,?,?,?,?)";
            var inserts = [empLast,empFirst, empEmail, theHashedPW, empAdmin];
            var sql = mysql.format(sqlins, inserts);
            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect("../webpages/enterusers.htm");
                res.end();
            });
        }
    });



});
app.get("/getemp/", function (req, res) {
    var empLast = req.query.empLast;
    var empFirst = req.query.empFirst;
    var empEmail = req.query.empEmail;
    var empAdmin = req.query.empAdmin;

    if (empAdmin == 1 || empAdmin == 0) {
        var empAdminadd = ' and EmployeeAdmin = ?';
        var empAdminvar = empAdmin;
    } else {
        var empAdminadd = 'and EmployeeAdmin Like ?';
        var empAdminvar = '%%';
    }
    var sqlsel = 'Select Employee.* from Employee ' +
        ' where EmployeeDeleted = ? '+
    'and EmployeeLastName Like ? and EmployeeFirstName Like ? and EmployeeEmail Like ? ' + empAdminadd
        + " ORDER BY EmployeeLastName ASC";

    var inserts = [0,'%' + empLast + '%', '%' + empFirst + '%', '%' + empEmail + '%',empAdminvar];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get("/allemp", function (req, res) {
    var sqlsel = 'select * from Employee where EmployeeDeleted = 0  ORDER BY EmployeeLastName ASC';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.post("/updateemp", function (req, res) {
    var empLast = req.body.empLast;
    var empFirst = req.body.empFirst;
    var empEmail = req.body.empEmail;
    var empAdmin = req.body.empAdmin;
    var empKey = req.body.empKey;
    console.log(empKey);

    var sqlins = "UPDATE Employee SET EmployeeLastName = ?, EmployeeFirstName = ?, " +
        " EmployeeEmail = ?, EmployeeAdmin = ? " +
        " WHERE EmployeeID = ? ";
    var inserts = [empLast, empFirst, empEmail, empAdmin, empKey];
    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");

        res.end();
    });
});
app.post("/deleteemp", function (req, res) {
    var empID = req.body.empID;

    var sqlins = "UPDATE Employee SET EmployeeDeleted = 1 " +
        " WHERE EmployeeID = ? ";
    var inserts = [empID];
    var sql = mysql.format(sqlins, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        else {
            console.log(data + "\n1 record deleted");
            res.send({
                redirect: '../webpages/deletemenuitem.html'
            });
        }
    });
});
app.post("/invent", function (req, res) {
    var inventName = req.body.inventName;
    var inventPrice = req.body.inventPrice;
    var inventQuantity = req.body.inventQuantity;
    var sqlins = "INSERT INTO Inventory (InventoryName,InventoryPrice,InventoryQuantity) VALUES (?,?,?)";
    var inserts = [inventName, inventPrice, inventQuantity];

    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect("../webpages/enterinventory.htm");
        res.end();
    });

});
app.get("/getinvent", function (req, res) {
    var inventName = req.query.inventName;
    var inventPrice = req.query.inventPrice;
    var inventQuantity = req.query.inventQuantity;

    var inventPricevar = '%%';
    var inventPriceadd = 'Like';
    var inventQuantityvar = '%%';
    var inventQuantityadd = 'Like';
    if (inventPrice.length > 0) { inventPricevar = inventPrice; inventPriceadd='='}
    if (inventQuantity.length > 0) { inventQuantityvar =inventQuantity; inventQuantityadd = '=' }

    var sqlsel = 'Select Inventory.* from Inventory ' +
        ' where  InventoryDeleted = 0 and InventoryName Like ? and InventoryPrice '
        + inventPriceadd + '? and InventoryQuantity ' + inventQuantityadd + ' ?';

    var inserts = ['%' + inventName + '%', inventPricevar, inventQuantityvar];
    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });

});
app.get("/allinvent", function (req, res) {
    var sqlsel = 'select * from Inventory where InventoryDeleted = 0';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.post("/updateinvent", function (req, res) {
    var inventName = req.body.inventName;
    var inventPrice = req.body.inventPrice;
    var inventQuantity = req.body.inventQuantity;
    var recKey = req.body.recKey;
    console.log(recKey);

    var sqlins = "UPDATE Inventory SET InventoryName = ?, InventoryPrice = ?, " +
        " InventoryQuantity = ? " +
        " WHERE InventoryID = ? ";
    var inserts = [inventName, inventPrice, inventQuantity, recKey];
    console.log(inserts);
    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");

        res.end();
    });
});
app.post("/deleteinvent", function (req, res) {
    var inventID = req.body.inventID;
    console.log(inventID);

    var sqlsel = "UPDATE Inventory SET InventoryName = 1"+
        " WHERE InventoryID = ? ";
    var inserts = [inventID];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
});
app.post("/menuitem", function (req, res) {
    var mtName = req.body.mtName;
    var mtPrice = req.body.mtPrice;
    var mtDescription = req.body.mtDescription;
    var mtAvialable = req.body.mtAvialable;
    var mCatID = req.body.mCatID;

  
    var sqlins = "INSERT INTO MenuItem (MenuItemName,MenuItemPrice,	MenuItemDescription,MenuItemAvialable,MenuCategoryID) VALUES (?,?,?,?,?)";
    var inserts = [mtName, mtPrice, mtDescription, mtAvialable, mCatID];

    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect("../webpages/entermenuitem.htm");
        res.end();
    });
});
app.get("/getmenuitem", function (req, res) {
    var mtName = req.query.mtName;
    var mtPrice = req.query.mtPrice;
    var mtDescription = req.query.mtDescription;
    var mtAvialable = req.query.mtAvialable;
    var mCatID = req.query.mCatID;

    if (mtAvialable <2 ) {
        var mtAvialableadd = ' and MenuItemAvialable = ?';
        var mtAvialablevar = mtAvialable;
    } else {
        var mtAvialableadd = 'and MenuItemAvialable Like ?';
        var mtAvialablevar = '%%';
    }
    var mtPricevar = '%%';
    var mtPriceadd = 'Like';
    if (mtPrice.length > 0) { mtPricevar = Number(mtPrice); mtPriceadd = '=' }



    var sqlsel = 'Select MenuItem.*,MenuCategoryType from MenuItem inner join ' +
        "MenuCategory on MenuCategory.MenuCategoryID = MenuItem.MenuCategoryID"+
        ' where  MenuItemDeleted = 0 and MenuItemName Like ? and MenuItemPrice '
        + mtPriceadd + '? and MenuItemDescription Like ?  and MenuCategoryType Like ? ' + mtAvialableadd +
        "ORDER BY MenuCategoryType ASC";

    var inserts = ['%' + mtName + '%', mtPricevar, '%' + mtDescription + '%', '%' + mCatID + '%', mtAvialablevar];
    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    con.execute(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        else {
            console.log(data);
            res.send(JSON.stringify(data));}
        
    });
});
app.get("/allmenuitem", function (req, res) {
    var sqlsel = 'select * from MenuItem  Where MenuItemDeleted = 0 and MenuItemAvialable = 1 ORDER BY MenuCategoryID ASC';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.post("/updatemenuitem", function (req, res) {
    var mtName = req.body.mtName;
    var mtPrice = req.body.mtPrice;
    var mtDescription = req.body.mtDescription;
    var mtAvialable = req.body.mtAvialable;
    var mCatID = req.body.mCatID;
    var recKey = req.body.recKey;
    console.log(recKey);

    var sqlins = "UPDATE MenuItem SET MenuItemName = ?, MenuItemPrice = ?, " +
        " MenuItemDescription = ?, MenuItemAvialable=?, MenuCategoryID=? " +
        " WHERE MenuItemID = ? ";
    var inserts = [mtName, mtPrice, mtDescription ,mtAvialable, mCatID, recKey];
    console.log(inserts);
    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");

        res.end();
    });
});
app.post("/deletemenuitem", function (req, res) {
    var mtID = req.body.mtID;


    var sqlsel = "UPDATE MenuItem SET MenuItemDeleted = 1 "+
        " WHERE MenuItemID = ? ";
    var inserts = [mtID];
    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        else {
            console.log(data+"\n1 record deleted");
            res.send({
                redirect: '../webpages/deletemenuitem.html'
            });}

    });
});
app.get("/allmenucat", function (req, res) {
    var sqlsel = 'select * from MenuCategory ORDER BY MenuCategoryType ASC';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.post("/order", function (req, res) {

    var sqlsel = 'select MAX(orderDaily) as daymax from OrderTrans '
        + ' WHERE DATE(OrderDate) = CURDATE()';

    var sql = mysql.format(sqlsel);

    var dailynumber = 1;


    var empID = req.body.empID;
    var orderStatus = req.body.orderStatus;
    var orderType = req.body.orderType;
    var orderCharged = req.body.orderCharged;
    var orderTableNumber = req.body.orderTableNumber;
    var orderRoomNumber = req.body.orderRoomNumber;

    con.query(sql, function (err, data) {
        console.log(data[0].daymax);

        if (!data[0].daymax) {
            dailynumber = 1;
        } else {
            dailynumber = data[0].daymax + 1;
        }
        var sqlins = "INSERT INTO OrderTrans (EmployeeID,OrderStatus,OrderType,OrderCharged,OrderTableNumber,OrderRoomNumber,orderDaily,orderDate,OrderTime) VALUES (?,?,?,?,?,?,?,CURDATE(),CURTIME())";
        var inserts = [empID, orderStatus, orderType, orderCharged, orderTableNumber, orderRoomNumber,dailynumber];

        var sql = mysql.format(sqlins, inserts);
        console.log(sql)
        con.execute(sql, function (err, result) {
            console.log(result);
            if (err) throw err;
            console.log("1 record inserted");
            res.redirect("../webpages/enterorder.html");
            res.end();
        });
    });
   
    
});
app.get("/getorder", function (req, res) {
    var empID = req.query.empID;
    var orderStatus = req.query.orderStatus;
    var orderType = req.query.orderType;
    var orderCharged = req.query.orderCharged;
    var orderTableNumber = req.query.orderTableNumber;
    var orderRoomNumber = req.query.orderRoomNumber;
    if (empID < 1 || empID == undefined) {
        var empAdd = ' and OrderTrans.EmployeeID Like ? ';
        var empVar = "%%";
    }
    else {
        var empAdd = ' and OrderTrans.EmployeeID = ? ';
        var empVar = empID;
    }
    if (orderStatus == 1 || orderStatus == 0) {
        var statusAdd = ' and OrderStatus = ?';
        var statusVar = orderStatus;
    } else {
        var statusAdd = 'and OrderStatus Like ?';
        var statusVar = '%%';
    }
    var orPricevar = '%%';
    var orPriceadd = 'Like';
    if (orderCharged.length > 0) { orderCharged = Number(orderCharged); orPriceadd = '=' }
    var orRoomvar = '%%';
    var orRoomadd = 'Like';
    if (orderRoomNumber.length > 0) { orRoomvar = Number(orderRoomNumber); orRoomadd = '=' }
    var orTablevar = '%%';
    var orTableadd = 'Like';
    if (orderTableNumber.length > 0) { orTablevar = Number(orderTableNumber); orTableadd = '=' }




    var sqlsel = 'Select OrderTrans.*'+
        ', Employee.EmployeeFirstName, Employee.EmployeeLastName from OrderTrans ' +
        ' inner join Employee on Employee.EmployeeID = OrderTrans.EmployeeID '+
        ' where OrderTransDeleted = 0 '
        + empAdd + statusAdd + ' and   OrderType Like ? and  OrderCharged '
        + orPriceadd + ' ? and  OrderRoomNumber ' + orRoomadd
        + ' ? and  OrderTableNumber ' + orTableadd+' ? '+
        "ORDER BY OrderDate DESC,OrderStatus ASC, OrderTime ASC, orderDaily DESC";

    var inserts = [empVar, statusVar, "%" + orderType + "%", orPricevar, orRoomvar, orTablevar];
    
    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    con.execute(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.post("/updateorder", function (req, res) {
    var empID = req.body.empID;
    var orderStatus = req.body.orderStatus;
    var orderType = req.body.orderType;
    var orderCharged = req.body.orderCharged;
    var orderTableNumber = req.body.orderTableNumber;
    var orderRoomNumber = req.body.orderRoomNumber;
    var recKey = req.body.recKey;

    var sqlins = "UPDATE OrderTrans SET EmployeeID = ?, OrderStatus = ?, " +
        " OrderType = ?,OrderCharged = ?,OrderTableNumber = ?,OrderRoomNumber = ?" +
        " WHERE OrderID = ? ";
    var inserts = [empID, orderStatus, orderType, orderCharged, orderTableNumber, orderRoomNumber, recKey];
    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record Updated");
       // res.redirect("../webpages/updateorders.html");
       // res.end();
    });

});
app.get("/allorder", function (req, res) {

    var sqlsel = 'select * from OrderTrans where Date(OrderDate) = CURDATE() and OrderTransDeleted = 0 ';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.post("/deleteorder", function (req, res) {
    var orderID = req.body.orderID;


    var sqlsel = "UPDATE OrderTrans SET OrderTransDeleted = 1 " +
        " WHERE OrderID = ? ";
    var inserts = [orderID];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        else {
            console.log(data + "\n1 record deleted");
        }
    });
});
app.post("/orderdt", function (req, res) {
    var orderID = req.body.orderID;
    var menuItemID = req.body.menuItemID;
    var orderQuanity = req.body.orderQuanity;


    var sqlsel = 'INSERT INTO OrderDetail (OrderID,MenuItemID,	OrderDetailQuantity) VALUES (?,?,?)';

    var inserts = [orderID, menuItemID, orderQuanity];
    var sql = mysql.format(sqlsel, inserts);
    con.execute(sql, function (err, result) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("1 record inserted");
        res.redirect("../webpages/enterordersdt.html");
        res.end();
    });
});
app.post("/deleteordersdt", function (req, res) {
    var orderID = req.body.orderID;


    var sqlsel = "UPDATE OrderDetail SET OrderDetailDeleted = 1 " +
        " WHERE OrderDetailID = ? ";
    var inserts = [orderID];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        else {
            console.log(data + "\n1 record deleted");
        }
    });
});
app.post("/updateorderds", function (req, res) {
    
    var orderID = req.body.orderID;
    var menuItemID = req.body.menuItemID;
    var orderQuanity = req.body.orderQuanity;
    var recKey = req.body.recKey;

    var sqlins = "UPDATE OrderDetail SET OrderID = ?, MenuItemID = ?, " +
        " OrderDetailQuantity = ? " +
        " WHERE OrderDetailID = ? ";
    var inserts = [orderID, menuItemID, orderQuanity, recKey];
    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("1 record Updated");
        res.end();
    });
});
app.get("/getorderdt", function (req, res) {
    var orderID = req.query.orderID;
    var menuItemID = req.query.menuItemID;
    var orderQuanity = req.query.orderQuanity;

    var orderQuanityvar = '%%';
    var orderQuanityadd = 'Like';
    if (orderQuanity.length > 0) { orderQuanityvar = Number(orderQuanity); orderQuanityadd = '='; }
    var menuItemIDvar = '%%';
    var menuItemIDadd = 'Like';
    if (menuItemID.length > 0) { menuItemIDvar = menuItemID;}
    var orderIDvar = '%%';
    var orderIDadd = 'Like';
    if (orderID.length > 0) { orderIDvar = orderID;}




    var sqlsel = 'select OrderDetail.*,OrderTrans.*,MenuItem.* from OrderDetail ' +
        " inner join OrderTrans on OrderTrans.OrderID = OrderDetail.OrderID" +
        " inner join MenuItem on MenuItem.MenuItemID = OrderDetail.MenuItemID " +
        ' WHERE OrderDetailDeleted = 0 and DATE(OrderDate) = CURDATE() and orderDaily '
        + orderIDadd + ' ? and MenuItemName ' + menuItemIDadd + '? and OrderDetailQuantity '
        + orderQuanityadd + ' ? '
        +'ORDER BY orderDaily DESC, orderStatus DESC';

    var inserts = [orderIDvar, menuItemIDvar, orderQuanityvar];
    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    console
    con.execute(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data);
        res.send(JSON.stringify(data));
    });
});
app.post("/hours", function (req, res) {
    var Type = req.body.hoursType;
    var start = req.body.opsStart;
    var end = req.body.opsEnd;


    var sqlsel = 'INSERT INTO OpsHours (OpsHoursType,OpsHoursStart,	OpsHoursEnd) VALUES (?,?,?)';

    var inserts = [Type, start, end];
    var sql = mysql.format(sqlsel, inserts);
    con.execute(sql, function (err, result) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("1 record inserted");
        res.redirect("../webpages/enterhours.html");
        res.end();
    });

})
app.get("/gethours", function (req, res) {
    var sqlsel = 'select * from OpsHours ORDER BY OpsHoursType DESC,OpsHoursId DESC';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });

})
app.get('/getsingleemp/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from Employee where EmployeeID = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleinvent/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from Inventory where InventoryID = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data);
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleordert/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from OrderDetail where OrderDetailID = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data);
        res.send(JSON.stringify(data));
    });
});
app.get('/getsinglemt/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from MenuItem where MenuItemID = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data);
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleorder/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from OrderTrans where OrderID = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data);
        res.send(JSON.stringify(data));
    });
});
app.get("/getallorderdt", function (req, res) {
    var orderID = req.query.orderID;
    var menuItemID = req.query.menuItemID;
    var orderQuanity = req.query.orderQuanity;

    var orderQuanityvar = '%%';
    var orderQuanityadd = 'Like';
    if (orderQuanity.length > 0) { orderQuanityvar = Number(orderQuanity); orderQuanityadd = '='; }
    var menuItemIDvar = '%%';
    var menuItemIDadd = 'Like';
    if (menuItemID.length > 0) { menuItemIDvar = menuItemID; }
    var orderIDvar = '%%';
    var orderIDadd = 'Like';
    if (orderID.length > 0) { orderIDvar = orderID; }




    var sqlsel = 'select OrderDetail.*,OrderTrans.*,MenuItem.* from OrderDetail ' +
        " inner join OrderTrans on OrderTrans.OrderID = OrderDetail.OrderID" +
        " inner join MenuItem on MenuItem.MenuItemID = OrderDetail.MenuItemID " +
        ' WHERE  OrderDetailDeleted = 0 and orderDate Like ? and orderDaily ' + orderIDadd + ' ? and MenuItemName '
        + menuItemIDadd + '? and OrderDetailQuantity ' + orderQuanityadd + ' ? '
        + 'ORDER BY orderDate Desc,orderDaily DESC';

    var inserts = ["%%", orderIDvar, menuItemIDvar, orderQuanityvar];
    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    console
    con.execute(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data);
        res.send(JSON.stringify(data));
    });
});

app.get("/getorderdtfororder", function (req, res) {

    var sqlsel = 'select OrderDetail.*,MenuItem.* from OrderDetail ' +
        " inner join MenuItem on MenuItem.MenuItemID = OrderDetail.MenuItemID ";

    var sql = mysql.format(sqlsel);
               
    con.execute(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get("/allorderpasttoo", function (req, res) {
    var ordate = req.query.orderDate;
    var ordaily = req.query.dailyNum;
    var orType = req.query.orderType;
    var orEmp = req.query.orderEmp;
    var orStatus = req.query.orderStatus;

    if (orEmp < 1 || orEmp == undefined) {
        var empAdd = ' and OrderTrans.EmployeeID Like ? ';
        var empVar = "%%";
    }
    else {
        var empAdd = ' and OrderTrans.EmployeeID = ? ';
        var empVar = orEmp;
    }
    if (ordaily < 1 || ordaily == undefined) {
        var ordailyAdd = ' and OrderTrans.orderDaily Like ? ';
        var ordailyVar = "%%";
    }
    else {
        var ordailyAdd = ' and OrderTrans.orderDaily = ? ';
        var ordailyVar = ordaily;
    }
    if (ordate < 1 || ordate == undefined) {
        var odAdd = ' OrderTrans.orderDate Like ? ';
        var odVar = "%%";
    }
    else {
        var odAdd = ' OrderTrans.orderDate = ? ';
        var odVar = ordate;
    }
    if (orStatus == 1 || orStatus == 0) {
        var statusAdd = ' and OrderStatus = ?';
        var statusVar = orStatus;
    } else {
        var statusAdd = 'and OrderStatus Like ?';
        var statusVar = '%%';
    }

    var sqlsel = 'Select OrderTrans.*, Employee.EmployeeFirstName, Employee.EmployeeLastName, OrderDetail.OrderDetailQuantity '+
         ',OrderDetail.OrderDetailDeleted, MenuItem.MenuItemName, OrderDetail.OrderID as ODDID ' +
        ' from OrderTrans ' +
        ' inner join Employee on Employee.EmployeeID = OrderTrans.EmployeeID ' +
        ' left join OrderDetail on OrderDetail.OrderID = OrderTrans.OrderID ' +
        ' left join MenuItem on MenuItem.MenuItemID = OrderDetail.MenuItemID ' +
        " Where " + odAdd + " and orderType like ? " + empAdd + statusAdd + ordailyAdd; 

    var inserts = [odVar, "%" + orType + "%", empVar, statusVar, ordailyVar]
    var subquery = mysql.format(sqlsel, inserts);
    var mainquery = " select * FROM (" + subquery + ") as TMP where OrderDetailDeleted = 0 or OrderDetailDeleted is Null " +
        "order by orderDate DESC, orderDaily DESC ";
    con.query(mainquery, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get("/allorderdate", function (req, res) {
    var sqlsel = 'Select OrderTrans.orderDate from OrderTrans ' +
        " order by orderDate DESC";
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get("/allorderdaily", function (req, res) {
    var sqlsel = 'Select orderDaily from OrderTrans ' +
        " order by orderDaily ASC";
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});