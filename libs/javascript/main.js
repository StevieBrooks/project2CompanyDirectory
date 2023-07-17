/*=======================================================
                        VARIABLES
========================================================*/

let personnelArr = null;
let departmentArr = null;
let tbody = $("table tbody");
// let delBtn = $('.del-btn');



/*======================================================
                    DOCUMENT ONLOAD
========================================================*/

$(document).ready(function() {

    personnelArr = [];

    const readyReq = new XMLHttpRequest();

    readyReq.open("GET", "libs/php/getAll.php", true);

    readyReq.onload = function() {
        if(this.status == 200) {
            let readyRes = JSON.parse(this.responseText);

            console.log(readyRes);
            readyRes.data.forEach(item => {
                personnelArr.push(item);
            })
            personnelArr.forEach(function(item) {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td class="number">${item.id}</td>
                    <td class="surname">${item.lastName}</td>
                    <td class="firstname">${item.firstName}</td>
                    <td class="email">${item.email}</td>
                    <td class="dept">${item.department}</td>
                    <td class="location">${item.location}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                </tr>
                `); 
            })

        }
    }

    readyReq.send();
    
})

/*===================================================
    ARRANGE DATA WITH HEADING ARROWS
=====================================================*/

// for this, need to make calls to backend to reverse things, then send back to front end to manifest

$(".db-index").click(function() {
    tbody.html($('tr',tbody).get().reverse());
})




/*====================================================
                CALLS TO PHP
======================================================*/

/*===============DELETE PERSONNEL BY ID==============*/
tbody.on("click", ".del-btn", function(e) {
    console.log(e.target.parentElement.parentElement.children[0].innerHTML);
    console.log(e.target.parentElement.parentElement);
    let id = e.target.parentElement.parentElement.children[0].innerHTML;
    let persRow = $(e.target.parentElement.parentElement);

    $.ajax({
        "url": `libs/php/deletePersonnelByID.php?id=${id}`,
        "type": "DELETE",
        "success": function(result) {
            console.log(result);
            console.log(personnelArr);
            persRow.slideUp();
        }
    })
})

/*===================GET ALL DEPTS======================*/
$(".dropdown-departments").click(function() {

    $.ajax({
        "url": "libs/php/getAllDepartments.php",
        "type": "GET",
        "success": function(result) {
            departmentArr = result.data;
            console.log(departmentArr);
            $(".db-head").html(`
            <tr>
                <th class="db-index">ID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Name <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-locationID">LocationID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-edDel">Edit / Delete <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
            </tr>
            `)
            $(".db-body").html("");
            departmentArr.forEach(item => {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td class="index">${item.id}</td>
                    <td class="name">${item.name}</td>
                    <td class="locationID">${item.locationID}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                </tr>
                `)
            })
        }
    })

})








// need to figure out how to restore original db and make a copy of this for when user refresh page, etc
