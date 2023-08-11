/*=======================================================
                        VARIABLES
========================================================*/

let departmentArr = null;
let locationArr = null;
let personnelArr = null;
let tbody = $("table tbody");
let perCount = 0;
let empQuery = null;
// DOUBLE CHECK THESE VARIABLES - THINK PERCOUNT AND THE ARR VARIABLES UNNECESSARY



/*======================================================
                    DOCUMENT ONLOAD
========================================================*/

$(document).ready(function() {
    getAllPersonnel();    
})


/*====================================================
                CALLS TO PHP
======================================================*/


/*===================GET ALL PERSONNEL======================*/
$(".dropdown-personnel").click(getAllPersonnel)

function getAllPersonnel() {

    $.ajax({
        "url": "libs/php/getAll.php",
        "type": "GET",
        "success": function(result) {
            $(".rec-count").text(result.data.length);

            $(".db-head").html(`
            <tr>
                <th class="db-index">ID <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-surname">Surname <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-firstname">First Name <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-email">Email <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-dept">Department <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-loc">Location <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
                <th class="db-edDel">Edit / Delete <span><i class="fa-solid fa-caret-down fa-sm"></i></span></th>
            </tr>
            `)
            $(".db-body").html("");
            result.data.forEach(item => {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td>${item.id}</td>
                    <td>${item.lastName}</td>
                    <td>${item.firstName}</td>
                    <td>${item.email}</td>
                    <td>${item.department}</td>
                    <td>${item.location}</td>
                    <td><button type="button" class="btn btn-success edit-person-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-person-btn">Delete</button></td>
                </tr>
                `)
            })
        }
    })

}


/*===================GET ALL DEPTS======================*/
$(".dropdown-departments").click(getAllDepartments)

function getAllDepartments() {

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
                    <td class="modify"><button type="button" class="btn btn-success edit-dept-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-dept-btn">Delete</button></td>
                </tr>
                `)
            })
        }
    })

}

/*===================GET ALL LOCATIONS======================*/
$(".dropdown-locations").click(getAllLocations)

function getAllLocations() {

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
                    <td class="modify"><button type="button" class="btn btn-success edit-loc-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-loc-btn">Delete</button></td>
                </tr>
                `)
            })
        }
    })

}


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
                    <td class="modify"><button type="button" class="btn btn-success edit-person-btn">Edit</button>
                    <button type="button" class="btn btn-danger del-person-btn">Delete</button></td>
                </tr>
                `)
            })

            setTimeout(function() {
                $('.emp-search').val("");
            }, 0o10)

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
                        <td class="modify"><button type="button" class="btn btn-success edit-person-btn">Edit</button>
                        <button type="button" class="btn btn-danger del-person-btn">Delete</button></td>
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
    $("#pdlSelect").val("Please Select");
    $(".pdl-card").first().css("display", "none");
})


$("#pdlSelect").on("change", function(e) {
    pdlChoice = e.target.value;
    console.log(pdlChoice);
    if(pdlChoice.length > 0) {
        // console.log($(".pdl-card").first());
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

              </select>
            `);

            $.ajax({
                url: "libs/php/getAllDepartments.php",
                type: "GET",
                success: function(result) {
                    result.data.forEach(item => {
                        $(".p-dept").append(`<option value="${item.id}">${item.name}</option>`)
                    })
                }
            })
            
            break;

        case "department":
            $(".pdl-card .card-body").html(`
            <input type="text" class="form-control d-name" id="formControlInput1" placeholder="Department name...">

            <select class="form-select d-location" id="deptLocForm" aria-label="Default select example">
                <option value="" selected>Department Location</option>

              </select>
            `);

            $.ajax({
                url: "libs/php/getAllLocations.php",
                type: "GET",
                success: function(result) {
                    // console.log(result);
                    result.data.forEach(item => {
                        $(".d-location").append(`<option value="${item.id}">${item.name}</option>`)
                    })
                }
            })

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

        pdlChoicePersonnel();

    } else if(pdlChoice == "department") {

        pdlChoiceDepartment();

    } else if(pdlChoice == "location") {

        pdlChoiceLocation();

    }
    
})

function pdlChoicePersonnel() {
    const firstName = $(".p-fname").val();
    const surname = $(".p-sname").val();
    const email = $(".p-email").val();
    const dept = $(".p-dept").val();
    let personPresent = false;

    $.ajax({
        url: "libs/php/getAllPersonnel.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            for(item of result.data) {
                if(item.firstName == firstName && item.lastName == surname && item.email == email) {
                     personPresent = true;
                     $("#personDenyModal").modal("show");
                     $("#addModal").modal("hide");
                     break;
                } 
            }
            if(!personPresent && firstName.length > 0 && surname.length > 0 && email.length > 0 && dept.length > 0) {
                $.ajax({
                    url: `libs/php/insertPersonnel.php?firstName=${firstName}&lastName=${surname}&email=${email}&departmentID=${dept}`,
                    type: "POST",
                    success: function(result) {
                        $("#addModal").modal("hide");
                        getAllPersonnel();
                    }
                })
            } else if (firstName.length == 0 || surname.length == 0 || email.length == 0 || dept.length == 0) {
                $("#formWarningModal").modal("show");
            }
        }
    })

}

function pdlChoiceDepartment() {

    const deptName = $(".d-name").val();
    const deptLocation = $(".d-location").val();
    let deptLocConvert = null;
    let deptPresent = false;
    console.log(deptLocation);

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        success: function(result) {
            console.log(result.data);
            for(item of result.data) {
                if(item.id == deptLocation) {
                    deptLocConvert = item.name;
                    console.log(deptLocConvert);
                    break;
                }
            }
        }
    })

    setTimeout(function() {

        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "GET",
            success: function(result) {
                console.log(deptLocConvert);
                for(item of result.data) {
                    if(deptName == item.name && deptLocConvert == item.location) {
                        deptPresent = true;
                        $("#deptDenyModal").modal("show");
                        $("#addModal").modal("hide");
                        $("#addModal .pdl-card").css("display", "none");
                        break;
                    }
                }
                if(!deptPresent && deptName.length > 0 && deptLocation.length > 0) {
                    $.ajax({
                        url: `libs/php/insertDepartment.php?name=${deptName}&locationID=${deptLocation}`,
                        type: "POST",
                        success: function(result) {
                            console.log(result);
                            $("#addModal").modal("hide");
                            getAllDepartments();
                        }
                    })
                } else if (deptName.length == 0 || deptLocation.length == 0) {
                    $("#formWarningModal").modal("show");
                }
            }
        })
    }, 0o01)

}

function pdlChoiceLocation() {

    const locationName = $(".l-name").val();
    let locationPresent = false;

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        success: function(result) {
            for(item of result.data) {
                if(locationName == item.name) {
                    console.log(item.name);
                    locationPresent = true;
                    $("#locDenyModal").modal("show");
                    $("#addModal").modal("hide");
                    $("#addModal .pdl-card").css("display", "none");
                    break;
                } else {
                    console.log("This item does not exist");
                }
            }
            if(!locationPresent && locationName.length > 0) {
                $.ajax({
                    url: `libs/php/insertLocation.php?name=${locationName}`,
                    type: "POST",
                    success: function(result) {
                        $("#addModal").modal("hide");
                        getAllLocations();
                    }
                })
            } else if (locationName.length == 0) {
                $("#formWarningModal").modal("show");
            }
        }
    })

}

/*===============EDIT PERSONNEL==============*/

let persID4Edit = null;
let persSName4Edit = null;
let persFName4Edit = null;
let persEmail4Edit = null;
let persDept4Edit = null;
let persLoc4Edit = null;
let deptEditChoice = null;
let locDropdown4PersonEdit = null;


tbody.on("click", ".edit-person-btn", function(e) {
    persID = e.target.parentElement.parentElement.children[0].innerHTML;
    persSName4Edit = e.target.parentElement.parentElement.children[1].innerHTML;
    persFName4Edit = e.target.parentElement.parentElement.children[2].innerHTML;
    persEmail4Edit = e.target.parentElement.parentElement.children[3].innerHTML;
    persDept4Edit = e.target.parentElement.parentElement.children[4].innerHTML;
    persLoc4Edit = e.target.parentElement.parentElement.children[5].innerHTML;
    $("#editPModal").modal("show");
    $("#editPLoc").css("display", "none");

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function(result) {
            result.data.forEach(item => {
                $("#editPDept").append(`
                <option value="${item.id}">${item.name}</option>
                `)
            })
        }
    })
})

$("#editPDept").on("change", function(e) {
    
    deptEditChoice = e.target.value;

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            result.data.forEach(item => {
                if(deptEditChoice == item.id) {
                    deptEditChoice = item.name;
                    setTimeout(populateLocDropdown, 0o01);
                }
            })
        }
    })
})

function populateLocDropdown() {
    locDropdown4PersonEdit = [];
    console.log(deptEditChoice);
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function(result) {
            result.data.forEach(item => {
                if(deptEditChoice == item.name) {
                    locDropdown4PersonEdit.push(item.location);
                    console.log(locDropdown4PersonEdit);
                    if(locDropdown4PersonEdit.length > 1) {
                        $("#editPLoc").css("display", "block");
                        locDropdown4PersonEdit.forEach(item => {
                            $("#editPLoc").append(`
                                <option value="${item}">${item}</option>
                            `)
                        })
                    } else {
                        $("#editPLoc").css("display", "none");
                    }
                }
            })
        }
    })
}

// need to autofill inputs with current info, then do checks to make sure new inputs ain't duplicates




/*===============DELETE PERSONNEL BY ID==============*/

let persID = null;
let persRow = null;

tbody.on("click", ".del-person-btn", function(e) {
    persID = e.target.parentElement.parentElement.children[0].innerHTML;
    persRow = $(e.target.parentElement.parentElement);

    $("#deletePModal").modal("show");

})

$(".delete-p-yes").click(function() {
        
    $.ajax({
        "url": `libs/php/deletePersonnelByID.php?id=${persID}`,
        "type": "DELETE",
        "success": function() {

            persRow.slideUp();
            getAllPersonnel();
        }
    })

})

/*===============DELETE DEPARTMENT BY ID==============*/

let deptID = null;
let deptRow = null;

tbody.on("click", ".del-dept-btn", function(e) {
    deptID = e.target.parentElement.parentElement.children[0].innerHTML;
    deptRow = $(e.target.parentElement.parentElement);
    let deptActive = false;

    $.ajax({
        url: "libs/php/getAllPersonnel.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            for(item of result.data) {
                if(deptID == item.departmentID) {
                    $("#deleteDeptModal").modal("show");
                    deptActive = true;
                    break;
                }
            }
            if(!deptActive) {
                $("#deleteDModal").modal("show");

            }
        }
    })
    
})

$(".delete-d-yes").click(function() {

    $.ajax({
        "url": `libs/php/deleteDepartmentByID.php?id=${deptID}`,
        "type": "DELETE",
        "success": function() {

            deptRow.slideUp();
            getAllDepartments();
        }
    })

})

/*===============DELETE LOCATION BY ID==============*/

let locID = null;
let locRow = null;
let locActive = null;

tbody.on("click", ".del-loc-btn", function(e) {
    locID = e.target.parentElement.parentElement.children[0].innerHTML;
    locRow = $(e.target.parentElement.parentElement);
    let locNameConvert = null;
    locActive = false;
    console.log(locActive);
    

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        success: function(result) {
            for(item of result.data) {
                if(locID == item.id) {
                    locNameConvert = item.name;
                    console.log(locNameConvert);
                    break;
                }
            }
        }
    })

    setTimeout(function() {
        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "GET",
            success: function(result) {
                for(item of result.data) {
                    if(locNameConvert == item.location) {
                        console.log(locNameConvert);
                        $("#deleteLocModal").modal("show");
                        locActive = true;
                        break;
                    }
                }
                if(!locActive) {
                    $("#deleteLModal").modal("show");
                    

                }
            }
        })
    }, 0o10)
 
})


$(".delete-l-yes").click(function() {

    console.log(locRow);

    $.ajax({
        "url": `libs/php/deleteLocationByID.php?id=${locID}`,
        "type": "DELETE",
        "success": function() {

            locRow.slideUp();
            getAllLocations();
        }
    })

})







/* TO-DO LIST

    - edit buttons, need to validate that row can be edited 
    - confirmation box for changes like edit
    - autoincrement id/primary key when new personnel, location, dept added
*/
