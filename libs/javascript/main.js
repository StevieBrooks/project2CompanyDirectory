/*=======================================================
                        VARIABLES
========================================================*/

let departmentArr = null;
let locationArr = null;
let personnelArr = null;
let tbody = $("table tbody");
let perCount = 0;
let empQuery = null;



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
    

    $.ajax({
        "url": `libs/php/deletePersonnelByID.php?id=${id}`,
        "type": "DELETE",
        "success": function(result) {
            // now working in real time but need to build in function to confirm user wants to delete
            perCount--;
            $(".rec-count").text(perCount);

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
            console.log(result);
            $(".rec-count").text(result.data.length);
            // departmentArr = result.data;
            // console.log(departmentArr);
            $(".db-head").html(`
            <tr>
                <th class="db-index">ID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-name">Name <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-locationID">Location <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-edDel">Edit / Delete <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
            </tr>
            `)
            $(".db-body").html("");
            result.data.forEach(item => {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td class="index">${item.id}</td>
                    <td class="name">${item.name}</td>
                    <td class="locationID">${item.location}</td>
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
            $(".rec-count").text(result.data.length);
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
            $(".rec-count").text(result.data.length);

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

    empQuery = $(".emp-search").val();
    console.log(empQuery);

    $.ajax({
        "url": `libs/php/search.php?empQuery=${empQuery}`,
        "type": "GET",
        "success": function(result) {
            console.log(result);
            $(".rec-count").text(result.data.length);
            
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
                    <td class="name">${item.department}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                </tr>
                `)
            })

        }
    })

})

$(document).on("keydown", function(e) {

    empQuery = $(".emp-search").val();

    if(e.originalEvent.keyCode == 13 && empQuery.length > 0) {

        console.log(empQuery.length);

        $.ajax({
            "url": `libs/php/search.php?empQuery=${empQuery}`,
            "type": "GET",
            "success": function(result) {

                $(".rec-count").text(result.data.length);
                
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
                        <td class="name">${item.department}</td>
                        <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                        <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                    </tr>
                    `)
                })
    
            }
        })
    }
})

/*===================ADD NEW======================*/
let pdlChoice = null;


$(".add-btn").click(function() {
    $("#addModal").modal("show");
})


$(".pdl-card").first().css("display", "none");

$("#pdlSelect").on("change", function(e) {
    pdlChoice = e.target.value;
    console.log(pdlChoice);
    if(pdlChoice.length > 0) {
        console.log($(".pdl-card").first());
        $(".pdl-card").first().css("display", "block");
        
    }

    switch(pdlChoice) {
        case "personnel":
            $(".pdl-card .card-body").html(`
            <input type="text" class="form-control p-fname" id="formControlInput1" placeholder="First Name....">

            <input type="text" class="form-control p-sname" id="formControlInput2" placeholder="Surname...">

            <input type="email" class="form-control p-email" id="formControlInput3" placeholder="Email">

            <select class="form-select p-dept" id="deptForm" aria-label="Default select example">
                <option value="" selected>Department</option>
                <option value="1">Human Resources</option>
                <option value="2">Sales</option>
                <option value="3">Marketing</option>
                <option value="4">Legal</option>
                <option value="5">Services</option>
                <option value="6">Research & Development</option>
                <option value="7">Product Management</option>
                <option value="8">Training</option>
                <option value="9">Support</option>
                <option value="10">Engineering</option>
                <option value="11">Accounting</option>
                <option value="12">Business Development</option>
              </select>
            `);
            break;

        case "department":
            $(".pdl-card .card-body").html(`
            <input type="text" class="form-control d-name" id="formControlInput1" placeholder="Department name...">

            <select class="form-select d-location" id="deptLocForm" aria-label="Default select example">
                <option value="" selected>Department Location</option>
                <option value="1">London</option>
                <option value="2">New York</option>
                <option value="3">Paris</option>
                <option value="4">Munich</option>
                <option value="5">Rome</option>
                <option value="7">Amsterdam</option>
              </select>
            `);
            break;

        case "location":
            $(".pdl-card .card-body").html(`
            <input type="text" class="form-control l-name" id="formControlInput1" placeholder="Location name...">
            `);
            break;

    }
})

$(".add-new-btn").click(function() {
    console.log(pdlChoice);

    if(pdlChoice == "personnel") {
        const firstName = $(".p-fname").val();
        const surname = $(".p-sname").val();
        const email = $(".p-email").val();
        const dept = $(".p-dept").val();

        if(firstName.length > 0 && surname.length > 0 && email.length > 0 && dept.length > 0) {
            $.ajax({
                url: `libs/php/insertPersonnel.php?firstName=${firstName}&lastName=${surname}&email=${email}&departmentID=${dept}`,
                type: "POST",
                success: function(result) {
                    console.log(result);
                    perCount++;
                    $(".rec-count").text(perCount);
                    // $(".db-body").append(`
                    // <tr class="emp-row">
                    //     <td class="index">103</td>
                    //     <td class="name">${surname}</td>
                    //     <td class="name">${firstName}</td>
                    //     <td class="name">${email}</td>
                    //     <td class="name">${dept}</td>
                    //     <td class="name">New York</td>
                    //     <td class="modify"><button type="button" class="btn btn-success edit-btn">Edit</button>
                    //     <button type="button" class="btn btn-danger del-btn">Delete</button></td>
                    // </tr>
                    // `) THIS AINT WORKING - will need to make another call to getAllPersonel or getPersonnelByID and use result from that to append table
                }
            }) 
        } 

    } else if(pdlChoice == "department") {
        const deptName = $(".d-name").val();
        const deptLocation = $(".d-location").val();

        if(deptName.length > 0 && deptLocation.length > 0) {
            $.ajax({
                url: `libs/php/insertDepartment.php?name=${deptName}&locationID=${deptLocation}`,
                type: "POST",
                success: function(result) {
                    console.log(result);
                }
            })
        }

    } else if(pdlChoice == "location") {
        const locationName = $(".l-name").val();
        // when creating new location, need to dynamically insert another option into addDepartment dropdown...could use ajax calls in the switch(pdlChoice) instead


        if(locationName.length > 0) {
            $.ajax({
                url: `libs/php/insertLocation.php?name=${locationName}`,
                type: "POST",
                success: function(result) {
                    console.log(result);
                }
            })
        }
    }
    
})








/* TO-DO LIST

    - autoincrement id/primary key when new personnel, location, dept added
    - make card vanish from modal when close
    - update table without needing refresh
    - change class for 'add to db' button depending on dropdown selection
    - restore original database
*/
