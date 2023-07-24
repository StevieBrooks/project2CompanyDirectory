/*=======================================================
                        VARIABLES
========================================================*/

let departmentArr = null;
let locationArr = null;
let personnelArr = null;
let tbody = $("table tbody");
let perCount = 0;



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
                perCount++;
                $(".rec-count").text(perCount);

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
    perCount--;
            $(".rec-count").text(perCount);

    $.ajax({
        "url": `libs/php/deletePersonnelByID.php?id=${id}`,
        "type": "DELETE",
        "success": function(result) {
            
            // this isn't working in real time. WHY?

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
            // departmentArr = result.data;
            // console.log(departmentArr);
            $(".db-head").html(`
            <tr>
                <th class="db-index">ID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Name <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-locationID">LocationID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-edDel">Edit / Delete <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
            </tr>
            `)
            $(".db-body").html("");
            result.data.forEach(item => {
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

/*===================GET ALL LOCATIONS======================*/
$(".dropdown-locations").click(function() {

    $.ajax({
        "url": "libs/php/getAllLocations.php",
        "type": "GET",
        "success": function(result) {
            // locationArr = result.data;
            // console.log(locationArr);
            $(".db-head").html(`
            <tr>
                <th class="db-index">ID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Name <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-edDel">Edit / Delete <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
            </tr>
            `)
            $(".db-body").html("");
            result.data.forEach(item => {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td class="index">${item.id}</td>
                    <td class="name">${item.name}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                </tr>
                `)
            })
        }
    })

})

/*===================GET ALL PERSONNEL======================*/
$(".dropdown-personnel").click(function() {

    $.ajax({
        "url": "libs/php/getAll.php",
        "type": "GET",
        "success": function(result) {

            $(".db-head").html(`
            <tr>
                <th class="db-index">ID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Surname <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">First Name <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Email <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Department <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Location <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-edDel">Edit / Delete <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
            </tr>
            `)
            $(".db-body").html("");
            result.data.forEach(item => {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td class="index">${item.id}</td>
                    <td class="name">${item.lastName}</td>
                    <td class="name">${item.firstName}</td>
                    <td class="name">${item.email}</td>
                    <td class="name">${item.department}</td>
                    <td class="name">${item.location}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                </tr>
                `)
            })
        }
    })

})

/*===================SEARCH EMPLOYEES======================*/
$(".emp-search-btn").click(function() {

    const empQuery = $(".emp-search").val();
    console.log(empQuery);

    $.ajax({
        "url": `libs/php/search.php?empQuery=${empQuery}`,
        "type": "GET",
        "success": function(result) {
            
            $(".db-head").html(`
            <tr>
                <th class="db-index">ID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Surname <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">First Name <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Email <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Department <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-edDel">Edit / Delete <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
            </tr>
            `)

            $(".db-body").html("");
            result.data.forEach(item => {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td class="index">${item.id}</td>
                    <td class="name">${item.lastName}</td>
                    <td class="name">${item.firstName}</td>
                    <td class="name">${item.email}</td>
                    <td class="name">${item.departmentID}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                </tr>
                `)
            })

        }
    })

})

/*===================ADD EMPLOYEE======================*/
$(".add-btn").click(function() {
    $("#addModal").modal("show");
})

$(".add-person-btn").click(function() {
    const fName = $("#formControlInput1").val();
    const sName = $("#formControlInput2").val();
    const email = $("#formControlInput3").val();
    const dept = $("#deptForm").val();
    console.log(dept);
})


// need to figure out how to restore original db and make a copy of this for when user refresh page, etc
