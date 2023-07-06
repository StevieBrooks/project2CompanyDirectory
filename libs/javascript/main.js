let personnelArr = null;


/*======================================================
                    DOCUMENT ONLOAD
========================================================*/

$(document).ready(function() {

    personnelArr = [];

    const readyReq = new XMLHttpRequest();

    readyReq.open("GET", "libs/php/getAll.php", true);

    readyReq.onload = function() {
        console.log("hey");
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
                    <td class="modify"><button type="button" class="btn btn-success">Edit</button>
                    <button type="button" class="btn btn-danger">Delete</button></td>
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
    let tbody = $('table tbody');
    tbody.html($('tr',tbody).get().reverse());
})

$(".db-surname").click(function() {
    let tbody = $('table tbody');
    tbody.html($('tr',tbody).get().reverse());
})

// $(".db-firstname").click(function() {
//     personnelArr.sort(function(item1, item2) {
//         return item1.firstName < item2.firstName ? -1 : 1;
//     })
//     personnelArr.forEach(function(item, index) {
//         $(".db-body").html(`
//         <tr class="emp-row">
//             <td class="number">${index + 1}</td>
//             <td class="surname">${item.lastName}</td>
//             <td class="firstname">${item.firstName}</td>
//             <td class="email">${item.email}</td>
//             <td class="dept">${item.department}</td>
//             <td class="location">${item.location}</td>
//             <td class="modify"><button type="button" class="btn btn-success">Edit</button>
//             <button type="button" class="btn btn-danger">Delete</button></td>
//         </tr>
//         `); 
//     })
//     console.log(personnelArr);
    
// })
