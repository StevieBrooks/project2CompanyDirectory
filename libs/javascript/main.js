/*==================GLOBAL VARIABLES======================*/

let tbody = $("table tbody");
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
        "cache": false,
        "data": {
            "empQuery": $("#empSearch").val()
        },
        "success": function(result) {

            console.log(result); 

            $("#personnelBtn").tab("show"); 
            $('#personnelTable').html("");
            
                const docFrag = document.createDocumentFragment();
            
                result.data.forEach(row => {
            
                    let record = document.createElement("tr");
            
                    let name = document.createElement("td");
                    name.classList = "align-middle text-nowrap";
                    name.innerHTML = `${row.lastName}, ${row.firstName}`;
            
                    let jobTitle = document.createElement("td");
                    jobTitle.classList = "align-middle text-nowrap d-none d-lg-table-cell";
                    jobTitle.innerHTML = row.jobTitle;
                   
                    let department = document.createElement("td");
                    department.classList = "align-middle text-nowrap d-none d-sm-table-cell";
                    department.innerHTML = row.department;
            
                    let email = document.createElement("td");
                    email.classList = "align-middle text-nowrap d-none d-md-table-cell";
                    email.innerHTML = row.email;
            
                    let buttons = document.createElement("td");
                    buttons.classList = "text-end text-nowrap";
            
                    let editBtn = document.createElement("button");
                    editBtn.classList = "btn btn-success btn-sm me-1";
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("data-bs-target", "#editPersonnelModal");
                    editBtn.setAttribute("data-id", row.id);
            
                    let editBtnImg = document.createElement("i");
                    editBtnImg.classList = "fa-solid fa-pen-to-square fa-lg";
                    editBtn.append(editBtnImg);
                    buttons.append(editBtn);
            
                    let removeBtn = document.createElement("button");
                    removeBtn.classList = "btn btn-danger btn-sm";
                    removeBtn.setAttribute("data-bs-toggle", "modal");
                    removeBtn.setAttribute("data-bs-target", "#deletePModal");
                    removeBtn.setAttribute("data-id", row.id);
            
                    let removeBtnImg = document.createElement("i");
                    removeBtnImg.classList = "fa-solid fa-trash fa-lg";
                    removeBtn.append(removeBtnImg);
                    buttons.append(removeBtn);
            
                    record.append(name);
                    record.append(jobTitle);
                    record.append(department);
                    record.append(email);
                    record.append(buttons);      
                    docFrag.append(record);
            
                });
            
                $("#personnelTable").append(docFrag);

        },
        "error": function(xhr, status, error) {
            console.error("AJAX Error:", status, error);
        }
    })
})

$("#empSearch").on("blur", function() {
    $("#empSearch").val("");
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
                    $("#addDept").append(`<option value="${item.id}">${item.name}</option>`)
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
                    $("#addDeptLoc").append(`<option value="${item.id}">${item.name}</option>`)
                })
            }
        })

        $("#addDepartmentModal").modal("show");

    } else {

        $("#addLocationModal").modal("show");

    }

})

$("#addPersonnelModal").on("hidden.bs.modal", function() {
    $("#addDept").html("");
})

$("#addDepartmentModal").on("hidden.bs.modal", function() {
    $("#addDeptLoc").html("");
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


/*====================FILTER TABLES================*/

let filterDeptName = null;
let filterLocName = null;

function populateDepartments(filterLocName) {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function(result) {
            $("#deptFilter").empty();
            $("#deptFilter").append("<option value=''>Department</option>");
            result.data.forEach(item => {
                if (item.location == filterLocName) {
                    $("#deptFilter").append(`
                        <option value="${item.id}">${item.name}</option>
                    `);
                }
            });
        }
    });
}

function populateDropdowns() {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        success: function(result) {
            $("#locFilter").html("<option value=''>Location</option>");
            result.data.forEach(item => {
                $("#locFilter").append(`
                    <option value="${item.id}">${item.name}</option>
                `);
            });
        }
    });

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function(result) {
            $("#deptFilter").html("<option value=''>Department</option>");
            result.data.forEach(item => {
                $("#deptFilter").append(`
                    <option value="${item.id}">${item.name}</option>
                `);
            });
        }
    });
}

$("#filterBtn").click(function() {
    $("#filterModal").modal("show");
    populateDropdowns();
});

$("#locFilter").on("change", function() {
    const filterLocation = $("#locFilter").val();
    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: "POST",
        data: {
            id: filterLocation
        },
        success: function(result) {
            filterLocName = result.data[0].name;
            populateDepartments(filterLocName);
        }
    });
});

$("#deptFilter").on("change", function() {
    const filterDepartment = $("#deptFilter").val();
    $.ajax({
        url: "libs/php/getDepartmentByID.php",
        type: "POST",
        data: {
            id: filterDepartment
        },
        success: function(result) {
            filterDeptName = result.data[0].name;
        }
    });
});


$("#sendFilterBtn").click(function(e) {

    e.preventDefault();

    $.ajax({
        url: "libs/php/getAll.php",
        type: "GET",
        success: function(result) {

            const filterResult = result.data.filter(item => {
                if(filterDeptName) {
                    return item.department == filterDeptName;
                } else if(filterLocName) {
                    return item.location == filterLocName;
                } else {
                    return item.department == filterDeptName && item.location == filterLocName;
                }
            })

            console.log(filterResult);

            $("#personnelBtn").tab("show"); 
            $(".tab-pane .db-body").html("");

            $('#personnelTable').html("");
            
                const docFrag = document.createDocumentFragment();
            
                filterResult.forEach(row => {
            
                    let record = document.createElement("tr");
            
                    let name = document.createElement("td");
                    name.classList = "align-middle text-nowrap";
                    name.innerHTML = `${row.lastName}, ${row.firstName}`;
            
                    let jobTitle = document.createElement("td");
                    jobTitle.classList = "align-middle text-nowrap d-none d-lg-table-cell";
                    jobTitle.innerHTML = row.jobTitle;
                   
                    let department = document.createElement("td");
                    department.classList = "align-middle text-nowrap d-none d-sm-table-cell";
                    department.innerHTML = row.department;
            
                    let location = document.createElement("td");
                    location.classList = "align-middle text-nowrap d-none d-lg-table-cell";
                    location.innerHTML = row.location;
            
                    let email = document.createElement("td");
                    email.classList = "align-middle text-nowrap d-none d-md-table-cell";
                    email.innerHTML = row.email;
            
                    let buttons = document.createElement("td");
                    buttons.classList = "text-end text-nowrap";
            
                    let editBtn = document.createElement("button");
                    editBtn.classList = "btn btn-success btn-sm me-1";
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("data-bs-target", "#editPersonnelModal");
                    editBtn.setAttribute("data-id", row.id);
            
                    let editBtnImg = document.createElement("i");
                    editBtnImg.classList = "fa-solid fa-pen-to-square fa-lg";
                    editBtn.append(editBtnImg);
                    buttons.append(editBtn);
            
                    let removeBtn = document.createElement("button");
                    removeBtn.classList = "btn btn-danger btn-sm";
                    removeBtn.setAttribute("data-bs-toggle", "modal");
                    removeBtn.setAttribute("data-bs-target", "#deletePModal");
                    removeBtn.setAttribute("data-id", row.id);
            
                    let removeBtnImg = document.createElement("i");
                    removeBtnImg.classList = "fa-solid fa-trash fa-lg";
                    removeBtn.append(removeBtnImg);
                    buttons.append(removeBtn);
            
                    record.append(name);
                    record.append(jobTitle);
                    record.append(department);
                    record.append(location);
                    record.append(email);
                    record.append(buttons);
            
                    docFrag.append(record);
            
                });
            
                $("#personnelTable").append(docFrag);

            $("#filterModal").modal("hide");
            filterDeptName = null;
            filterLocName = null;
        }
    })

})

$("#filterModal").on("hidden.bs.modal", function() {
    $("#filterForm").trigger("reset");
});



/*================REFRESH TABLES==================*/

$("#refreshBtn").click(function() {

    if(personnelBtn.hasClass("active")) {
        getAllPersonnel();
    } else if (departmentsBtn.hasClass("active")) {
        getAllDepartments();
    } else {
        getAllLocations();
    }

})


/*===================GET ALL PERSONNEL======================*/
$("#personnelBtn").click(getAllPersonnel)

function getAllPersonnel() {

    $.ajax({
        "url": "libs/php/getAll.php",
        "type": "GET",
        "success": function(result) {

                $('#personnelTable').html("");
            
                const docFrag = document.createDocumentFragment();
            
                result.data.forEach(row => {
            
                    let record = document.createElement("tr");
            
                    let name = document.createElement("td");
                    name.classList = "align-middle text-nowrap";
                    name.innerHTML = `${row.lastName}, ${row.firstName}`;
            
                    let jobTitle = document.createElement("td");
                    jobTitle.classList = "align-middle text-nowrap d-none d-lg-table-cell";
                    jobTitle.innerHTML = row.jobTitle;
                   
                    let department = document.createElement("td");
                    department.classList = "align-middle text-nowrap d-none d-sm-table-cell";
                    department.innerHTML = row.department;
            
                    let location = document.createElement("td");
                    location.classList = "align-middle text-nowrap d-none d-lg-table-cell";
                    location.innerHTML = row.location;
            
                    let email = document.createElement("td");
                    email.classList = "align-middle text-nowrap d-none d-md-table-cell";
                    email.innerHTML = row.email;
            
                    let buttons = document.createElement("td");
                    buttons.classList = "text-end text-nowrap";
            
                    let editBtn = document.createElement("button");
                    editBtn.classList = "btn btn-success btn-sm me-1";
                    editBtn.setAttribute("data-bs-toggle", "modal");
                    editBtn.setAttribute("data-bs-target", "#editPersonnelModal");
                    editBtn.setAttribute("data-id", row.id);
            
                    let editBtnImg = document.createElement("i");
                    editBtnImg.classList = "fa-solid fa-pen-to-square fa-lg";
                    editBtn.append(editBtnImg);
                    buttons.append(editBtn);
            
                    let removeBtn = document.createElement("button");
                    removeBtn.classList = "btn btn-danger btn-sm";
                    removeBtn.setAttribute("data-bs-toggle", "modal");
                    removeBtn.setAttribute("data-bs-target", "#deletePModal");
                    removeBtn.setAttribute("data-id", row.id);
            
                    let removeBtnImg = document.createElement("i");
                    removeBtnImg.classList = "fa-solid fa-trash fa-lg";
                    removeBtn.append(removeBtnImg);
                    buttons.append(removeBtn);
            
                    record.append(name);
                    record.append(jobTitle);
                    record.append(department);
                    record.append(location);
                    record.append(email);
                    record.append(buttons);
            
                    docFrag.append(record);
            
                });
            
                $("#personnelTable").append(docFrag);
            
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
                    <td class="align-middle text-end text-nowrap">
                        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editDepartmentsModal" data-deptid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteDModal" data-deptid="${item.id}"><i class="fa-solid fa-trash"></i></button>
                    </td>
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
                    <td class="align-middle text-end text-nowrap">
                        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editLocationsModal" data-locid="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteLModal" data-locid="${item.id}"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
                `)
            })
        }
    })

}



/*===============EDIT PERSONNEL==============*/

$("#editPersonnelModal").on("show.bs.modal", function (e) {

    console.log(e.relatedTarget.attributes[3].nodeValue);
  
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: e.relatedTarget.attributes[3].nodeValue
      },
      success: function (result) {

        console.log(result);
  
        if (result.status.code == "200") {
  
          $("#editPersonnelID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
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


$("#editPersonnelModal").on("hidden.bs.modal", function() {
    $("#editPDept").html("");
})


$("#editPersonnelModal").on("submit", function(e) {

    e.preventDefault();

    
    const editPersData = {
        firstName: $("#editPersonnelFirstName").val(),
        lastName: $("#editPersonnelLastName").val(),
        jobTitle: $("#editPersonnelJobTitle").val(),
        email: $("#editPersonnelEmail").val(),
        departmentID: $("#editPDept").val(),
        id: $("#editPersonnelID").val()
    };

    $.ajax({
        url: `libs/php/editPersonnel.php`,
        type: "POST",
        data: editPersData,
        success: function(result) {
            console.log(result);
            getAllPersonnel();
            $("#editPersonnelModal").modal("hide");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error performing operation.")
          }
    })
})


/*===================EDIT DEPARTMENT==================*/

$("#editDepartmentsModal").on("show.bs.modal", function (e) {

    console.log($(e.relatedTarget).attr("data-deptid"));

    popDeptLocations();
  
    $.ajax({
      url:
        "libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-deptid") 
      },
      success: function (result) {

        console.log(result);
  
        if (result.status.code == "200") {

            $("#editDepartmentsID").val(result.data[0].id);

            $("#editDepartmentName").val(result.data[0].name);     

            getDeptLocation(result);
          
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
        type: "POST",
        success: function(result) {
            const alphabeticalLocs = result.data.sort((a, b) => a.name.localeCompare(b.name));
                alphabeticalLocs.forEach(item => {
                    $("#editDepartmentLocation").append(`<option value="${item.id}">${item.name}</option>`)
                })
        }
    })
}


$("#editDepartmentsModal").on("hidden.bs.modal", function() {
    $("#editDepartmentLocation").html("");
})


function getDeptLocation(input) {
    console.log(input);
    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: "POST",
        cache: false,
        data: {
            id: input.data[0].locationID
        },
        success: function(result) {
            console.log(result);
            const deptLoc4Edit = result.data[0].id;
            $("#editDepartmentLocation").val(deptLoc4Edit);
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
            $("#editDepartmentsModal").modal("hide");
            getAllDepartments();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error performing operation.")
          }
    })
})


/*===================EDIT LOCATION====================*/

$("#editLocationsModal").on("show.bs.modal", function (e) {

    console.log(e.relatedTarget.attributes[4]);
  
    $.ajax({
      url: "libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-locid") 
      },
      success: function (result) {
        console.log(result);

        if(result.status.name == "ok") {

            $("#editLocationID").val(result.data[0].id);
            $("#editLocationName").val(result.data[0].name);

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

$("#editLocationsModal").on("submit", function(e) {

    e.preventDefault();

    
    const formData = $("#editLocationsForm").serialize();
    console.log(formData);

    $.ajax({
        url: `libs/php/editLocation.php`,
        type: "POST",
        data: formData,
        success: function(result) {
            $("#editLocationsModal").modal("hide");
            getAllLocations();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error performing operation.")
          }
    })
})


/*===============DELETE PERSONNEL BY ID==============*/

let persRow = null;

$("#deletePModal").on("show.bs.modal", function (e) {

    console.log(e);

    
    $("#delPersonnelID").val(e.relatedTarget.attributes[3].nodeValue);
    persRow = $(e.relatedTarget).closest("tr");
    const employeeForDelete = persRow[0].children[0].innerText;
    
    $("#deletePModal .modal-body p").html(`This action cannot be undone. Are you sure you want to remove ${formatEmployee(employeeForDelete)}?`)

});

function formatEmployee(emp) {

  const parts = emp.split(', ');

  if (parts.length === 2) {
    const reversedName = parts[1] + ' ' + parts[0];
    return reversedName;
  } else {
    return emp;
  }

}

$("#deleteP").click(function(e) {

    const parsedID = parseInt($("#delPersonnelID").val());

    console.log(parsedID);
        
    $.ajax({
        "url": `libs/php/deletePersonnelByID.php`,
        "type": "POST",
        "data": {
            id: parsedID
        },
        "success": function(result) {
            console.log(result);
            $("#deletePModal").modal("hide");
            persRow.slideUp();
            getAllPersonnel();
        },
        error: function(err) {
            console.log(err);
        }
    })

})

/*===============DELETE DEPARTMENT BY ID==============*/

let deptID = null;
let deptRow = null;
let personnelAssigned = null;

$("#deleteDModal").on("show.bs.modal", function(e) {
    console.log(e.relatedTarget.attributes[4].nodeValue);
    $("#delDeptID").val(e.relatedTarget.attributes[4].nodeValue);
    deptRow = $(e.relatedTarget).closest("tr");
    const departmentForDelete = deptRow[0].children[0].innerText;

    personnelAssigned = [];

    $.ajax({
        url: "libs/php/getAllPersonnel.php",
        type: "GET",
        success: function(result) {
            console.log(result);
            result.data.forEach(item => {
                if(item.departmentID == $(e.relatedTarget).attr("data-deptid")) {
                    personnelAssigned.push(item);
                } 
            })
            
            if(personnelAssigned.length > 0) {

                $("#deleteDModal .modal-title").html("Apologies!");
                $("#deleteDModal .modal-body p").html(`There are currently ${personnelAssigned.length} employees assigned to ${departmentForDelete}. Unable to remove.`);
                $("#deleteDModal .modal-footer").html(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`)

            } else {

                $("#deleteDModal .modal-title").html("Delete Department");
                $("#deleteDModal .modal-body p").html(`This action cannot be undone. Are you sure you want to delete ${departmentForDelete}?`);
                $("#deleteDModal .modal-footer").html(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button><button type="button" class="btn btn-primary" id="deleteD">Yes</button>
                `)

            }
        }
    })
})

$(document).on("click", "#deleteD", function(e) {
    console.log(e);
    deptID = $("#delDeptID").val();

    $.ajax({
        url: `libs/php/deleteDepartmentByID.php`,
        type: "POST",
        data: {
            id: $("#delDeptID").val()
        }, 
        success: function(result) {
            console.log(result);
            $("#deleteDModal").modal("hide");
            deptRow.slideUp();
            getAllDepartments();
        }
    })
})

/*===============DELETE LOCATION BY ID==============*/

let locID = null;
let location4Delete = null;
let locRow = null;
let departmentsAssigned = null;

$("#deleteLModal").on("show.bs.modal", function(e) {
    console.log(e.relatedTarget.attributes[4].nodeValue);
    $("#delLocID").val(e.relatedTarget.attributes[4].nodeValue);
    locRow = $(e.relatedTarget).closest("tr");
    const locationForDelete = locRow[0].children[0].innerText;

    departmentsAssigned = [];

    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: "POST",
        data: {
            id: $(e.relatedTarget).attr("data-locid")
        },
        success: function(result) {
            location4Delete = result.data[0].name
        } 
    })

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "POST",
        success: function(result) {
            console.log(result);
            result.data.forEach(item => {
                if(item.location == location4Delete) {
                    departmentsAssigned.push(item);
                } 
            })
            
            if(departmentsAssigned.length > 0) {

                $("#deleteLModal .modal-title").html("Apologies!");
                $("#deleteLModal .modal-body p").html(`There are currently ${departmentsAssigned.length} departments assigned to ${locationForDelete}. Unable to remove.`);
                $("#deleteLModal .modal-footer").html(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`)

            } else {

                $("#deleteLModal .modal-title").html("Delete Location");
                $("#deleteLModal .modal-body p").html(`This action cannot be undone. Are you sure you want to delete ${locationForDelete}?`);
                $("#deleteLModal .modal-footer").html(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button><button type="button" class="btn btn-primary" id="deleteL">Yes</button>`)

            }
        }
    })
})

$(document).on("click", "#deleteL", function(e) {
    console.log(e);
    locID = $("#delLocID").val();

    $.ajax({
        url: `libs/php/deleteLocationByID.php`,
        type: "POST",
        data: {
            id: $("#delLocID").val()
        }, 
        success: function(result) {
            console.log(result);
            $("#deleteLModal").modal("hide");
            locRow.slideUp();
            getAllLocations();
        }
    })
})

