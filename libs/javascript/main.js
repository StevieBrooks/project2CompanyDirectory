/*=======================================================
                        VARIABLES
========================================================*/

let personnelArr = null;
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
            personnelArr.forEach(function(item, index) {
                $(".db-body").append(`
                <tr class="emp-row">
                    <td class="number">${index + 1}</td>
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

$(".db-index").click(function() {
    tbody.html($('tr',tbody).get().reverse());
})

$(".db-surname").click(function() {
    tbody.html($('tr',tbody).get().reverse());
})

$(".db-firstname").click(function() {
    console.log($(".db-body")[0]);
    $(".db-body").sort(function(item1, item2) {
        return item1.firstName < item2.firstName ? -1 : 1;
    })
    
})


/*====================================================
                CALLS TO PHP
======================================================*/

tbody.on("click", ".del-btn", function(e) {
    console.log(e.target.parentElement.parentElement.children[0].innerHTML);
    let id = e.target.parentElement.parentElement.children[0].innerHTML;

    $.ajax({
        "url": `libs/php/deletePersonnelByID?id=${id}`,
        "type": "DELETE",
        "success": function(result) {
            console.log(result);
        }
    })
})