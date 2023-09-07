/*==================GLOBAL VARIABLES======================*/

let tbody = $("table tbody");
let empQuery = null;
const personnelBtn = $("#personnelBtn");
const departmentsBtn = $("#departmentsBtn");
const locationsBtn = $("#locationsBtn");



/*==================DOCUMENT ONLOAD=====================*/

$(document).ready(function() {
    getAllPersonnel();    
})



/*===================SEARCH EMPLOYEES======================*/

$("#empSearch").on("keyup", function() {

    $.ajax({
        "url": `libs/php/search.php`,
        "type": "GET",
        "data": {
            empQuery: $("#empSearch").val()
        },
        "success": function(result) {

            $(".db-body").html("");
            result.data.forEach(item => {
                $("#personnel-tab-pane .db-body").append(`
                <tr>
                    <td class="align-middle text-nowrap">${item.lastName}</td>
                    <td class="align-middle text-nowrap">${item.firstName}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.email}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.jobTitle}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.department}</td>
                    <td class="text-end text-nowrap"><button type="button" class="btn btn-success edit-person-btn" data-empid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button type="button" class="btn btn-danger del-person-btn" data-empid="${item.id}"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
                `)
            })

        }
    })
})


/*===================ADD NEW======================*/

$("#addBtn").click(function() {

    console.log($("#departmentsBtn"));

    if(personnelBtn[0].attributes[7].nodeValue == "true") {

        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "GET",
            success: function(result) {
                const alphabeticalDepts = result.data.sort((a, b) => a.name.localeCompare(b.name));
                alphabeticalDepts.forEach(item => {
                    $("#addDept").append(`<option value="${item.id}">${item.name}</option>`)
                })
            }
        })

        $("#addPersonnelModal").modal("show");

    } else if(departmentsBtn[0].attributes[7].nodeValue == "true") {

        $.ajax({
            url: "libs/php/getAllLocations.php",
            type: "GET",
            success: function(result) {
                const alphabeticalLocs = result.data.sort((a, b) => a.name.localeCompare(b.name));
                alphabeticalLocs.forEach(item => {
                    $("#addDeptLoc").append(`<option value="${item.id}">${item.name}</option>`)
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

    const addPersData = {
        firstName: $("#addFirstName").val(),
        lastName: $("#addLastName").val(),
        jobTitle: $("#addJobTitle").val(),
        email: $("#addEmail").val(),
        departmentID: $("#addDept").val()
    }

    let personPresent = false;

    $.ajax({

        url: "libs/php/getAllPersonnel.php",
        type: "GET",
        success: function(result) {

            for(item of result.data) {
                if(item.email == addPersData.email) {
                     personPresent = true;
                     $("#personDenyModal").modal("show");
                     $("#addPersonnelModal").modal("hide");
                     break;
                } 
            }
            
            if(!personPresent) {
                $.ajax({
                    url: `libs/php/insertPersonnel.php`,
                    type: "POST",
                    data: addPersData,
                    success: function(result) {
                        $("#addPersonnelModal").modal("hide");
                        getAllPersonnel();
                    }
                })
            } 
        }
    })

    $(this).trigger("reset");

})


$("#addDepartmentForm").on("submit", function(e) {

    e.preventDefault();

    const addDeptData = {
        name: $("#addDepartmentName").val(),
        locationID: $("#addDeptLoc").val(),
    }

    let deptLocConvert = null;
    let deptPresent = false;

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        success: function(result) {
            console.log(result.data);
            for(item of result.data) {
                if(item.id == addDeptData.locationID) {
                    deptLocConvert = item.name;
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
                    if(addDeptData.name == item.name && deptLocConvert == item.location) {
                        deptPresent = true;
                        $("#deptDenyModal").modal("show");
                        $("#addDepartmentModal").modal("hide");
                        break;
                    }
                }
                if(!deptPresent) {
                    $.ajax({
                        url: `libs/php/insertDepartment.php`,
                        type: "POST",
                        data: addDeptData,
                        success: function(result) {
                            console.log(result);
                            $("#addDepartmentModal").modal("hide");
                            getAllDepartments();
                        }
                    })
                } 
            }
        })
    }, 0o01)

    $(this).trigger("reset");

})


$("#addLocationForm").on("submit", function(e) {

    e.preventDefault();

    const addLocData = {
        name: $("#addLocationName").val()
    }

    let locationPresent = false;

    
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            for(item of result.data) {
                if(addLocData.name == item.name) {
                    locationPresent = true;
                    $("#locDenyModal").modal("show");
                    $("#addLocationModal").modal("hide");
                    break;
                } 
            }
            if(!locationPresent) {
                
                $.ajax({
                    url: `libs/php/insertLocation.php`,
                    type: "POST",
                    data: addLocData,
                    success: function(result) {
                        $("#addLocationModal").modal("hide");
                        getAllLocations();
                    }
                })
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
                    <tr>
                        <td class="align-middle text-nowrap">${item.lastName}</td>
                        <td class="align-middle text-nowrap">${item.firstName}</td>
                        <td class="align-middle text-nowrap d-none d-md-table-cell">${item.email}</td>
                        <td class="align-middle text-nowrap d-none d-md-table-cell">${item.jobTitle}</td>
                        <td class="align-middle text-nowrap d-none d-md-table-cell">${item.department}</td>
                        <td class="text-end text-nowrap"><button type="button" class="btn btn-success edit-person-btn" data-empid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger del-person-btn" data-empid="${item.id}"><i class="fa-solid fa-trash"></i></button></td>
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

            $(".db-body").html("");
            result.data.forEach(item => {
                $("#departments-tab-pane .db-body").append(`
                <tr>
                    <td class="align-middle text-nowrap">${item.name}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.location}</td>
                    <td class="align-middle text-end text-nowrap"><td><button type="button" class="btn btn-success edit-dept-btn" data-deptid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button><button type="button" class="btn btn-danger del-dept-btn" data-deptid="${item.id}"><i class="fa-solid fa-trash"></i></button></td>
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
                <tr data-locid="${item.id}">
                    <td class="align-middle text-nowrap">${item.name}</td>
                    <td class="align-middle text-end text-nowrap"><button type="button" class="btn btn-success edit-loc-btn" data-locid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button><button type="button" class="btn btn-danger del-loc-btn" data-locid="${item.id}"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
                `)
            })
        }
    })

}



/*===============EDIT PERSONNEL==============*/

let persID4Edit = null;

tbody.on("click", ".edit-person-btn", function(e) {

    console.log(e.currentTarget.dataset.empid);

    persID4Edit = e.currentTarget.dataset.empid;

    $("#editPersonnelModal").modal("show");
    $("#editPersonnelModal .dept-location").css("display", "none");

})

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
    $.ajax({
      url:
        "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: persID4Edit // use jquery to target html element (line 37 codepen)
      },
      success: function (result) {
        console.log(result);
  
        if (result.status.code == "200") {
  
          $("#editPersonnelID").val(result.data.personnel[0].id);
  
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmail").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPDept").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPDept").val(result.data.personnel[0].departmentID);
          
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

$("#editPersonnelModal").on("submit", function(e) {

    e.preventDefault();

    
    const formData = $("#editPersonnelForm").serialize();
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
deptID4Edit = null;

tbody.on("click", ".edit-dept-btn", function(e) {

    deptID4Edit = e.currentTarget.dataset.deptid;
    $("#editDepartmentsForm #editDepartmentsID").val(deptID4Edit);

    $("#editDepartmentsModal").modal("show");

})

$("#editDepartmentsModal").on("show.bs.modal", function (e) {

    console.log($("#editDepartmentsForm #editDepartmentsID").val());

    popDeptLocations();
  
    $.ajax({
      url:
        "libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: deptID4Edit 
      },
      success: function (result) {
  
        if (result.status.code == "200") {

            getDeptLocation(result);
            
            $("#editDepartmentName").val(result.data[0].name);        
          
        } else {
          $("#editDepartmentsModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentsModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
});

function popDeptLocations() {
    
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        success: function(result) {
            const alphabeticalLocs = result.data.sort((a, b) => a.name.localeCompare(b.name));
                alphabeticalLocs.forEach(item => {
                    $("#editDepartmentLocation").append(`<option value="${item.id}">${item.name}</option>`)
                })
        }
    })
}

function getDeptLocation(input) {
    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: "GET",
        data: {
            id: input.data[0].locationID
        },
        success: function(result) {
            const deptLoc4Edit = result.data[0].id;
            $("#editDepartmentLocation").val(deptLoc4Edit);

            console.log(result);
            console.log(deptLoc4Edit);
            console.log($("#editDepartmentLocation"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentsModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    })
}

$("#editDepartmentsModal").on("submit", function(e) {

    e.preventDefault();

    
    const formData = $("#editDepartmentsForm").serialize();
    console.log(formData);

    $.ajax({
        url: `libs/php/editDepartment.php`,
        type: "POST",
        data: formData,
        success: function(result) {
            console.log(result);
            getAllDepartments();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error performing operation.")
          }
    })
})


/*===================EDIT LOCATION====================*/

locID4Edit = null;

tbody.on("click", ".edit-loc-btn", function(e) {

    locID4Edit = e.currentTarget.dataset.locid;
    $("#editLocationsForm #editLocationID").val(locID4Edit);

    $("#editLocationsModal").modal("show");

})

$("#editLocationsModal").on("show.bs.modal", function (e) {
  
    $.ajax({
      url: "libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: locID4Edit 
      },
      success: function (result) {
        console.log(result);

        if(result.status.name == "ok") {
            $("#editLocationName").val(result.data[0].name);
        } else {
            $("#editLocationName").val("Apologies: No info available");
        }
       
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentsModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
});

$("#editLocationsModal").on("submit", function(e) {

    e.preventDefault();

    
    const formData = $("#editLocationsForm").serialize();
    console.log(formData);

    $.ajax({
        url: `libs/php/editLocation.php`,
        type: "POST",
        data: formData,
        success: function(result) {
            console.log(result);
            getAllLocations();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error performing operation.")
          }
    })
})


/*===============DELETE PERSONNEL BY ID==============*/

let persID = null;
let persRow = null;

tbody.on("click", ".del-person-btn", function(e) {

    persID = e.currentTarget.dataset.empid;
    persRow = $(this).closest("tr");

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

    deptID = e.currentTarget.dataset.deptid;
    deptRow = $(this).closest("tr");
    
    $("#deleteDModal").modal("show");

})

$(".delete-d-yes").click(function() {
    console.log(deptID);

    $.ajax({
        url: `libs/php/deleteDepartmentByID.php?id=${deptID}`,
        type: "DELETE",
        success: function() {

            deptRow.slideUp();
            getAllDepartments();
        }
    })

})

/*===============DELETE LOCATION BY ID==============*/

let locID = null;
let locRow = null;

tbody.on("click", ".del-loc-btn", function(e) {
    
    locID = e.currentTarget.dataset.locid;
    locRow = $(this).closest("tr");

    $("#deleteLModal").modal("show");
 
})


$(".delete-l-yes").click(function() {

    $.ajax({
        "url": `libs/php/deleteLocationByID.php?id=${locID}`,
        "type": "DELETE",
        "success": function() {

            locRow.slideUp();
            getAllLocations();
        }
    })

})




