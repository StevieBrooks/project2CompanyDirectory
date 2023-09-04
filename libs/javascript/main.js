/*==================GLOBAL VARIABLES======================*/

let tbody = $("table tbody");
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
                <tr class="emp-row">
                    <td>${item.lastName}</td>
                    <td>${item.firstName}</td>
                    <td class="db-email-item">${item.email}</td>
                    <td class="db-jobtitle-item">${item.jobTitle}</td>
                    <td class="db-dept-item">${item.department}</td>
                    <td class="modify"><button type="button" class="btn btn-success edit-person-btn" data-empid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
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

        $("#addDepartmentModal").modal("show");

    } else {

        $("#addLocationModal").modal("show");

    }

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

    $(this).trigger("reset");

})


$("#addDepartmentForm").on("submit", function(e) {

    e.preventDefault();

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

    $(this).trigger("reset");

})


$("#addLocationForm").on("submit", function(e) {

    e.preventDefault();

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

    $(this).trigger("reset");

})


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
                <tr class="emp-row">
                    <td>${item.lastName}</td>
                    <td>${item.firstName}</td>
                    <td class="db-email-item">${item.email}</td>
                    <td class="db-jobtitle-item">${item.jobTitle}</td>
                    <td class="db-dept-item">${item.department}</td>
                    <td class="db-loc-item">${item.location}</td>
                    <td><button type="button" class="btn btn-success edit-person-btn" data-empid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
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
                <tr class="emp-row">
                    <td class="name">${item.name}</td>
                    <td class="locationID">${item.location}</td>
                    <td class="modify"><td><button type="button" class="btn btn-success edit-dept-btn" data-deptid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button><button type="button" class="btn btn-danger del-dept-btn"><i class="fa-solid fa-trash"></i></button></td>
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
// let deptEditChoice = null;
// let locDropdown4PersonEdit = null;
// let editPDeptID = null;
// let enteredEmail = null;
// let ajaxCall = null;

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
    $.ajax({
      url:
        "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: persID4Edit 
      },
      success: function (result) {
        console.log(result);
  
        if (result.status.code == "200") {
  
          $("#editPersonnelID").val(result.data.personnel[0].id);
  
          persSName4Edit = $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          persFName4Edit = $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          persJobTitle4Edit = $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          persEmail4Edit = $("#editPersonnelEmail").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPDept").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          persDept4Edit = $("#editPDept").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });


tbody.on("click", ".edit-person-btn", function(e) {

    persID4Edit = e.currentTarget.dataset.empid;

    $("#editPersonnelModal").modal("show");
    $("#editPersonnelModal .dept-location").css("display", "none");

})

$("#editPersonnelModal").on("submit", function(e) {

    e.preventDefault();

    
    let formData = $("#editPersonnelForm").serialize();
    console.log(formData);

    $.ajax({
        url: `libs/php/editPersonnel.php?id=${persID4Edit}`,
        type: "POST",
        data: formData,
        success: function(result) {
            console.log(result);
            getAllPersonnel();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error performing operation.")
          }
    })
})


/*===================EDIT DEPARTMENT==================*/




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