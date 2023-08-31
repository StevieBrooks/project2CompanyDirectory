/*==================GLOBAL VARIABLES======================*/

let departmentArr = null;
let locationArr = null;
let personnelArr = null;
let tbody = $("table tbody");
let perCount = 0;
let empQuery = null;
const navItemPers = $(".nav-item-pers");
const navItemDept = $(".nav-item-dept");
const navItemLoc = $(".nav-item-loc");
const personnelBtn = $("#personnelBtn");
const departmentsBtn = $("#departmentsBtn");
const locationsBtn = $("#locationsBtn");



/*==================DOCUMENT ONLOAD=====================*/

$(document).ready(function() {
    getAllPersonnel();    
    navItemPers.addClass("show");
})



/*===================SEARCH EMPLOYEES======================*/

$("#empSearch").on("keyup", function() {

    empQuery = $(".emp-search").val();

    $.ajax({
        "url": `libs/php/search.php?empQuery=${empQuery}`,
        "type": "GET",
        "success": function(result) {

            console.log(result);

            $(".db-body").html("");
            result.data.forEach(item => {
                $("#personnel-tab-pane .db-body").append(`
                <tr class="emp-row" data-empid="${item.id}">
                    <td>${item.lastName}</td>
                    <td>${item.firstName}</td>
                    <td class="db-email-item">${item.email}</td>
                    <td class="db-jobtitle-item">${item.jobTitle}</td>
                    <td class="db-dept-item">${item.department}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-person-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button type="button" class="btn btn-danger del-person-btn"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
                `)
            })

        }
    })
})


/*===================ADD NEW======================*/

$("#addBtn").click(function() {

    if(personnelBtn.hasClass("active")) {

        $("#addPersonnelModal .modal-body").html(`
        <form id="addPersonnelForm">

            <input type="hidden" id="addPersonnelID">

            <input type="text" class="form-control p-fname my-2" id="addFirstName" placeholder="First Name....">
            
            <input type="text" class="form-control p-sname my-2" id="addLastName" placeholder="Surname...">

            <input type="text" class="form-control p-jobtitle my-2" id="addJobTitle" placeholder="Job Title">

            <input type="email" class="form-control p-email my-2" id="addEmail" placeholder="Email">

            <select class="form-select p-dept my-2" id="addDept" aria-label="Default select example">
                <option value="" selected>Department</option>
              </select>

        </form>
        `)

        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "GET",
            success: function(result) {
                const alphabeticalDepts = result.data.sort((a, b) => a.name.localeCompare(b.name));
                alphabeticalDepts.forEach(item => {
                    $(".p-dept").append(`<option value="${item.id}">${item.name}</option>`)
                })
            }
        })

        $("#addPersonnelModal").modal("show");

    } else if(departmentsBtn.hasClass("active")) {

        $("#addModal .modal-title").html("Add New Department");

        $("#addModal .modal-body").html(`
        <input type="text" class="form-control d-name my-2" id="formControlInput1" placeholder="Department name...">

        <select class="form-select d-location my-2" id="deptLocForm" aria-label="Default select example">
            <option value="" selected>Department Location</option>

          </select>
        `)

        $.ajax({
            url: "libs/php/getAllLocations.php",
            type: "GET",
            success: function(result) {
                const alphabeticalLocs = result.data.sort((a, b) => a.name.localeCompare(b.name));
                alphabeticalLocs.forEach(item => {
                    $(".d-location").append(`<option value="${item.id}">${item.name}</option>`)
                })
            }
        })

    } else {

        $("#addModal .modal-title").html("Add New Location");

        $("#addModal .modal-body").html(`
        <input type="text" class="form-control l-name" id="formControlInput1" placeholder="Location name...">
        `)

    }

    $("#addModal").modal("show");

})


$("#addPersonnelForm").on("submit", function(e) {

    e.preventDefault();

    console.log("hi");

    const firstName = $(".p-fname").val();
    const surname = $(".p-sname").val();
    const email = $(".p-email").val();
    const jobTitle = $(".p-jobtitle").val();
    const dept = $(".p-dept").val();
    let personPresent = false;

    $.ajax({
        url: "libs/php/getAllPersonnel.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            for(item of result.data) {
                if(item.firstName == firstName && item.lastName == surname && item.email == email && item.jobTitle == jobTitle) {
                     personPresent = true;
                     $("#personDenyModal").modal("show");
                     $("#addModal").modal("hide");
                     break;
                } 
            }
            if(!personPresent && firstName.length > 0 && surname.length > 0 && email.length > 0 && dept.length > 0) {
                $.ajax({
                    url: `libs/php/insertPersonnel.php?firstName=${firstName}&lastName=${surname}&jobTitle=${jobTitle}&email=${email}&departmentID=${dept}`,
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

})


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


/*===================GET ALL PERSONNEL======================*/
$("#personnelBtn").click(getAllPersonnel)

function getAllPersonnel() {

    $.ajax({
        "url": "libs/php/getAll.php",
        "type": "GET",
        "success": function(result) {

            $(".db-body").html("");
            result.data.forEach(item => {
                $("#personnel-tab-pane .db-body").append(`
                <tr class="emp-row" data-empid="${item.id}">
                    <td>${item.lastName}</td>
                    <td>${item.firstName}</td>
                    <td class="db-email-item">${item.email}</td>
                    <td class="db-jobtitle-item">${item.jobTitle}</td>
                    <td class="db-dept-item">${item.department}</td>
                    <td class="db-loc-item">${item.location}</td>
                    <td><button type="button" class="btn btn-success edit-person-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button type="button" class="btn btn-danger del-person-btn"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
                `)
            })
        }
    })

}


/*===================GET ALL DEPTS======================*/
$("#departmentsBtn").click(getAllDepartments)


function getAllDepartments() {

    $.ajax({
        "url": "libs/php/getAllDepartments.php",
        "type": "GET",
        "success": function(result) {
            console.log(result);

            $(".db-body").html("");
            result.data.forEach(item => {
                $("#departments-tab-pane .db-body").append(`
                <tr class="emp-row" data-deptid="${item.id}">
                    <td class="name">${item.name}</td>
                    <td class="locationID">${item.location}</td>
                    <td class="modify"><button type="button" class="btn btn-danger del-dept-btn"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
                `)
            })
        }
    })

}

/*===================GET ALL LOCATIONS======================*/
$("#locationsBtn").click(getAllLocations)

function getAllLocations() {

    $.ajax({
        "url": "libs/php/getAllLocations.php",
        "type": "GET",
        "success": function(result) {
            $(".db-body").html("");
            result.data.forEach(item => {
                $("#locations-tab-pane .db-body").append(`
                <tr class="emp-row" data-locid="${item.id}">
                    <td class="name">${item.name}</td>
                    <td class="modify"><button type="button" class="btn btn-danger del-loc-btn"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
                `)
            })
        }
    })

}




/*===============EDIT PERSONNEL==============*/

let persID4Edit = null;
let persSName4Edit = null;
let persFName4Edit = null;
let persEmail4Edit = null;
let persJobTitle4Edit = null;
let persDept4Edit = null;
let deptEditChoice = null;
let locDropdown4PersonEdit = null;
let editPDeptID = null;
let enteredEmail = null;
let ajaxCall = null;


tbody.on("click", ".edit-person-btn", function(e) {

    persID4Edit = this.parentElement.parentElement.attributes[1].nodeValue;
    console.log(persID4Edit);
    persSName4Edit = this.parentElement.parentElement.children[0].innerHTML;
    persFName4Edit = this.parentElement.parentElement.children[1].innerHTML;
    persEmail4Edit = this.parentElement.parentElement.children[2].innerHTML;
    persJobTitle4Edit = this.parentElement.parentElement.children[3].innerHTML;
    persDept4Edit = this.parentElement.parentElement.children[4].innerHTML;
    
    
    console.log($("#editPModal .edit-surname"));

    $("#editPModal .edit-surname").attr("value", persSName4Edit);
    $("#editPModal .edit-firstname").attr("value", persFName4Edit);
    $("#editPModal .edit-email").attr("value", persEmail4Edit);
    $("#editPModal .edit-jobtitle").attr("value", persJobTitle4Edit);


    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function(result) {
            const alphabeticalDepts = result.data.sort((a, b) => a.name.localeCompare(b.name));
            result.data.forEach(item => {
                $("#editPDept").append(`
                <option value="${item.id}">${item.name}</option>
                `)
                if(item.name == persDept4Edit) {
                    editPDeptID = item.id;
                    setTimeout(popPDeptChoice, 0o10);
                }
            })
        }
    })

    $("#editPModal").modal("show");
    $("#editPModal .dept-location").css("display", "none");

})

function popPDeptChoice() {
    
    $("#editPModal .edit-dept").val(editPDeptID);
        
    $("#editPModal").modal("show");
    $("#editPLoc").css("display", "none");

}

$("#editPDept").on("change", function(e) {
    
    choice = e.target.value;

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            result.data.forEach(item => {
                if(choice == item.id) {
                    choice = item.location;
                    console.log(choice);
                    $("#editPModal .dept-location").css("display", "block");
                    $("#editPModal .dept-location")[0].attributes[2].value = choice;
                }
            })
        }
    })
})

$(".edit-p-update").click(function() {

    if($("#editPModal .edit-surname").val().length > 0) {
        persSName4Edit = $("#editPModal .edit-surname").val();
    }

    if($("#editPModal .edit-firstname").val().length > 0) {
        persFName4Edit = $("#editPModal .edit-firstname").val();
    }

    enteredEmail = $("#editPModal .edit-email").val();
    
    checkExistingEmail(enteredEmail);

    if(isValidEmail(enteredEmail)) {
        persEmail4Edit = enteredEmail;
    } else if(enteredEmail.length == 0) {
        persEmail4Edit = persEmail4Edit;
        console.log(persEmail4Edit);
    } else {
        $("#editPDeny1").modal("show");
    }

    if($("#editPModal .edit-jobtitle").val().length > 0) {
        persJobTitle4Edit = $("#editPModal .edit-jobtitle").val();
    }


    persDept4Edit = $("#editPModal .edit-dept").val();

    setTimeout(function() {
        $("#editPModal .edit-surname").val("");
        $("#editPModal .edit-firstname").val("");
        $("#editPModal .edit-email").val("");
        $("#editPModal .edit-jobtitle").val("");
    }, 1000)
    


})

ajaxCall = function() {

    $.ajax({
        url: `libs/php/editPersonnel.php?firstName=${persFName4Edit}&lastName=${persSName4Edit}&jobTitle=${persJobTitle4Edit}&email=${persEmail4Edit}&departmentID=${persDept4Edit}&id=${persID4Edit}`,
        type: "POST",
        success: function(result) {
            console.log(result);
            getAllPersonnel();
        }
    })

}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

function checkExistingEmail(emailAddy) {
    console.log(emailAddy);
    $.ajax({
        url: "libs/php/getAllPersonnel.php",
        type: "GET",
        success: function(result) {
            let emailExists = false;
            for (item of result.data) {
                if (item.email === emailAddy) {
                    emailExists = true;
                    break; 
                }
            }

            if (emailExists) {
                $("#editPDeny2").modal("show");
            } else {
                ajaxCall();
            }
        }
    });
}



/*===============DELETE PERSONNEL BY ID==============*/

let persID = null;
let persName = null;
let persRow = null;

tbody.on("click", ".del-person-btn", function(e) {


    persID = this.parentElement.parentElement.attributes[1].nodeValue;
    persName = this.parentElement.parentElement.children[1].innerHTML + " " + this.parentElement.parentElement.children[0].innerHTML;
    persRow = $(e.target.parentElement.parentElement);

    $("#deletePModal .modal-title").html(`Delete ${persName}`);
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
let deptName = null;
let deptRow = null;

tbody.on("click", ".del-dept-btn", function(e) {
    deptID = this.parentElement.parentElement.attributes[1].nodeValue;
    deptName = this.parentElement.parentElement.children[0].innerHTML;
    deptRow = $(e.target.parentElement.parentElement);
    let deptActive = false;

    $("#deleteDModal .modal-title").html(`Delete ${deptName} Department`);

    $.ajax({
        url: "libs/php/getAllPersonnel.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            for(item of result.data) {
                if(deptID == item.departmentID) {
                    $("#deleteDeptModal").modal("show");
                    $("#deleteDeptModal .modal-title").html(`Issue Deleting ${deptName} Department`);
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
let locName = null;
let locRow = null;
let locActive = null;

tbody.on("click", ".del-loc-btn", function(e) {
    locID = this.parentElement.parentElement.attributes[1].nodeValue;
    locName = this.parentElement.parentElement.children[0].innerHTML;
    locRow = $(e.target.parentElement.parentElement);
    let locNameConvert = null;
    locActive = false;
    console.log(locActive);

    $("#deleteLModal .modal-title").html(`Delete ${locName} `);
    

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
                        $("#deleteLocModal .modal-title").html(`Issue Deleting ${locName}`);
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