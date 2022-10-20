// Fungsi baru berjalan ketika dokumen selesai loading
$(document).ready(function () {
    show_budget();
    goal_get();
    });

// Formating input number
const formatNumber = (number, type) => {

    let budgetString = number.toString(),
    split = budgetString.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if(ribuan){
		separator = sisa ? '.' : '';
		rupiah += separator + ribuan.join('.');
	}
 
	rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    
    return `${type === 'inc' ? '+' :  '-'} ${rupiah}` 
}



// Mengubah tanggal dari timestamp menjadi tanggal biasanya
function date_convert(date){
    const d = new Date(date*1000);
    return d.toDateString()
}

///////////////////////////////////////////////////////////////////////////
//   /$$$$$$                                  /$$              
//  /$$__  $$                                | $$              
// | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
// | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
// | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
// | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
// |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
//  \______/ |__/       \_______/ \_______/   \___/   \_______/
///////////////////////////////////////////////////////////////////////////
function post_budget() {
    let desc =  $(".input-description").val();
    let value = Math.abs($(".input-value").val());
    let budget_type = $( ".budget_type option:selected" ).val();
    if (value === "" || desc === ""){
        $(".input_btn").attr({"data-bs-toggle": "modal", "data-bs-target" : "#exampleModal"});
        $(".modal-body").text("Description and value must be filled");
        return false;
    } 
    else {
        $.ajax({
            type: "POST",
            url:"/budgetin/post",
            data:{
                description_give: desc,
                value_give:value,
                type_give:budget_type
            },
            success:function (response){
            console.log(response)
            // window.location.reload();
            }
    })
    }
}

$(".input_btn").click(function () {
console.log('masuk 2')
post_budget()
})

///////////////////////////////////////////////////////////////////////////
//  /$$$$$$$                            /$$
// | $$__  $$                          | $$
// | $$  \ $$  /$$$$$$   /$$$$$$   /$$$$$$$
// | $$$$$$$/ /$$__  $$ |____  $$ /$$__  $$
// | $$__  $$| $$$$$$$$  /$$$$$$$| $$  | $$
// | $$  \ $$| $$_____/ /$$__  $$| $$  | $$
// | $$  | $$|  $$$$$$$|  $$$$$$$|  $$$$$$$
// |__/  |__/ \_______/ \_______/ \_______/
///////////////////////////////////////////////////////////////////////////
// Menampilkan daftar budget dari server (server dapat dari database)
function show_budget() {
    // Mengosongkan daftar income dan expense
    $("#income-list").empty();
    $("#expense-list").empty();

    // Mengambil data dari server 
    $.ajax({
        type: "GET",
        url: "/budgetin",
        data: {},
        success: function (response) {
        // Menampilkan total income, expense dan selisih di bagian atas
        if (response['kolom_atas']['total_budget'] >= 0){
            $("#total_budget").append(formatNumber(response["kolom_atas"]['total_budget'],'inc'))
        } else {
            $("#total_budget").append(formatNumber(Math.abs(response["kolom_atas"]['total_budget']),'exp'))
        }
        $("#final_income").append(formatNumber(response["kolom_atas"]['final_income'],'inc'))
        $("#final_expense").append(formatNumber(response["kolom_atas"]['final_expense'],'exp'))

        // Menampilkan daftar budget di bagian bawah    
        let rows = response["budgets"];
            for (let i = 0; i < rows.length; i++) {
              if (rows[i]['type'] === 'inc'){
                  let num = rows[i]["num"];
                  let date = rows[i]["date"];
                  let description = rows[i]["description"];
                  let value = rows[i]["value"];

                  temp_html_income = `
                  <div class="item" id="income-${num}">
                    <div class="income-expense-content">
                        <div class="item-date">${date_convert(date)}</div>
                        <div class="item-description">${description}</div>
                        <div class="item-value">${formatNumber(value, 'inc')}</div>
                    </div>
                        <div class="value-cta">
                            <div class="item-delete-update">
                                <button onclick="update_budget(${num})"><i class="fas fa-edit"></i></button>
                                <button onclick="delete_budget(${num})" class="delete_button"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                  </div>
                  `
                  $("#income-list").append(temp_html_income);

              } else if (rows[i]['type'] === 'exp') {
                  let num = rows[i]["num"];
                  let date = rows[i]["date"];
                  let description = rows[i]["description"];
                  let value = rows[i]["value"];

                  temp_html_expense = `
                    <div class="item" id="expense-${num}">
                        <div class="income-expense-content">
                            <div class="item-date">${date_convert(date)}</div>
                            <div class="item-description">${description}</div>
                            <div class="item-value">${formatNumber(value, 'exp')}</div>
                        </div>
                        <div class="value-cta">
                            <div class="item-delete-update">
                                <button onclick="update_budget(${num})"><i class="fas fa-edit"></i></button>
                                <button onclick="delete_budget(${num})" class="delete_button"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                  </div>
                  `
                  $("#expense-list").append(temp_html_expense);
                }}}
    })
}

///////////////////////////////////////////////////////////////////////////
//  /$$   /$$                 /$$             /$$              
// | $$  | $$                | $$            | $$              
// | $$  | $$  /$$$$$$   /$$$$$$$  /$$$$$$  /$$$$$$    /$$$$$$ 
// | $$  | $$ /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
// | $$  | $$| $$  \ $$| $$  | $$  /$$$$$$$  | $$    | $$$$$$$$
// | $$  | $$| $$  | $$| $$  | $$ /$$__  $$  | $$ /$$| $$_____/
// |  $$$$$$/| $$$$$$$/|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
//  \______/ | $$____/  \_______/ \_______/   \___/   \_______/
//           | $$                                              
//           | $$                                              
//           |__/                                
///////////////////////////////////////////////////////////////////////////
function hide_modal(){
    $(".modal-container").hide();
}

function update_budget(num) {
    $.ajax({
        type: "GET",
        url: "/budgetin",
        data: { num_give: num },
        success: function (response) {
            console.log(response.budgets)
            for(let i=0; i<response.budgets.length; i++){
                if(num == response.budgets[i].num){
                    temp_modal_container = `
                    <div class="modal-container">
                        <div class="modal-card">
                            <div class="update-budget">
                            <div class="update_type">
                                <select class="budget_type" id="update_type">
                                ${
                                    response.budgets[i].type === 'inc' ?
                                    `
                                        <option value="inc">+</option>
                                        <option value="exp">-</option>
                                    ` :
                                    `
                                        <option value="exp">-</option>
                                        <option value="inc">+</option>
                                    `
                                }
                                </select>
                            </div>
                            <input
                                type="text"
                                class="update-description"
                                value="${response.budgets[i].description}"
                                placeholder="Add Description"
                            />
                            <input
                                type="number"
                                class="update-value"
                                value="${response.budgets[i].value}"
                                placeholder="Value"
                            />
                            <button class="update_btn" onclick="update_budget_post(${num})" id="update_btn_modal"><i class="fas fa-check"></i></button>
                            <button class="update_btn update_btn-delete" onclick="hide_modal()"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                    </div>
                    `
                    $(".content").append(temp_modal_container);
                }                
            }
        },
    });
}

//onclick="update_budget_post(${num})"

function update_budget_post(num) {
    let desc =  $(".update-description").val();
    let value = $(".update-value").val();
    let budget_type = $( "#update_type option:selected" ).val();

    $.ajax({
        type: "POST",
        url:"/budgetin/update/post",
        data:{
            num_give: num,
            description_give: desc,
            value_give: value,
            type_give: budget_type
        },
        success:function (response){
        console.log(response)
        window.location.reload();
        }
})
}

///////////////////////////////////////////////////////////////////////////
//  /$$$$$$$            /$$             /$$              
// | $$__  $$          | $$            | $$              
// | $$  \ $$  /$$$$$$ | $$  /$$$$$$  /$$$$$$    /$$$$$$ 
// | $$  | $$ /$$__  $$| $$ /$$__  $$|_  $$_/   /$$__  $$
// | $$  | $$| $$$$$$$$| $$| $$$$$$$$  | $$    | $$$$$$$$
// | $$  | $$| $$_____/| $$| $$_____/  | $$ /$$| $$_____/
// | $$$$$$$/|  $$$$$$$| $$|  $$$$$$$  |  $$$$/|  $$$$$$$
// |_______/  \_______/|__/ \_______/   \___/   \_______/
///////////////////////////////////////////////////////////////////////////
function delete_budget(num) {

    temp_modal_container = `
    <div class="modal-container">
        <div class="modal-card-delete">
            <div class="delete-budget">
                <div class="modal-delete-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">WARNING</h1>
                    </div>
                    <div class="modal-body-delete">Are sure want to deleted this budget?</div>
                </div>
                <div class="modal-footer">
                    <button class="update_btn" onclick="clickDelete(${num})" id="update_btn_modal">Hapus <i class="fas fa-trash"></i></button>
                    <button class="update_btn update_btn-delete" onclick="hide_modal()">Batal <i class="fas fa-times"></i></button>
                </div>
            </div>
        </div>
    </div>
    `
    $(".content").append(temp_modal_container);
}
//     $(".delete_button").attr({"data-bs-toggle": "modal", "data-bs-target" : "#deleteModal"});
//     $(".modal-body-delete").text("Are sure want to deleted this budget?")
//     clickDelete(num)
// }

function clickDelete (num){
// $("#deleteButton").on('click', () => {
    $.ajax({
            type: "POST",
            url: "/delete",
            data: {num_give: num},
            success: function (response) {
            console.log(response)
            window.location.reload();
            },
        });
    }
//     )
// }



$(".input-description, .input-value").on("change",() => {
    $(".input_btn").prop("disabled",false);
});

function init() {
    $(".input_btn").prop("disabled",true);
}

// function confirmDialogModal (message){
//     $(".delete_button").attr({"data-bs-toggle": "modalDelete", "data-bs-target" : "#deleteModal"});
//     if (result) {
//     //Logic to delete the item
// }
// }
// confirmDialogModal('are you sure')
init();

///////////////////////////////////////////////////////////////////////////
//   /$$$$$$                      /$$
//  /$$__  $$                    | $$
// | $$  \__/  /$$$$$$   /$$$$$$ | $$
// | $$ /$$$$ /$$__  $$ |____  $$| $$
// | $$|_  $$| $$  \ $$  /$$$$$$$| $$
// | $$  \ $$| $$  | $$ /$$__  $$| $$
// |  $$$$$$/|  $$$$$$/|  $$$$$$$| $$
// \______/  \______/  \_______/|__/
///////////////////////////////////////////////////////////////////////////
// Menambahkan Goal
// function muncul_modal_goal(){
//     temp_modal_container = `
//         <div class="modal-container">
//             <div class="modal-card-delete">
//                 <div class="delete-budget">
//                     <div class="modal-delete-content">
//                         <input
//                         type="text"
//                         class="update-description"
//                         value=""
//                         placeholder="Add goal value"
//                         id="modal-update-goal"
//                         />
//                         <button class="update_btn" onclick="goal_post()" id="add_goal"><i class="fas fa-plus"></i></button>
//                         <button class="update_btn update_btn-delete" onclick="hide_modal()"><i class="fas fa-times"></i></button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         `
//     $(".content").append(temp_modal_container);
// }

// function tambah_tombol_goal() {
//     const value_goal = $('#saving_goal_value span').html();
//     console.log(value_goal)
//     if (value_goal != ""){
//         tambah_tombol=`
//         <button class="goals_btn" id="tombol_satu_edit">
//         <i class="fas fa-edit"></i>
//         <button class="goals_btn" id="tombol_satu_hapus">
//         <i class="fas fa-trash"></i>
//         `
//         $("#tempat_tombol").append(tambah_tombol);
//         $('#tombol_satu_tambah').hide();
//     } else {
//         $('#tombol_satu_tambah').show();
//     }
// };
// tambah_tombol_goal()

// function goal_post() {
//     const value_goal = $('#modal-update-goal').val();
//     if (value_goal === ''){
//         $("#add_goal").attr({"data-bs-toggle": "modal", "data-bs-target" : "#exampleModal"});   
//         $(".modal-body").text("Description and value must be filled");
//     } else {
//         let value = Math.abs($("#modal-update-goal").val());
//         $.ajax({
//             type: "POST",
//             url:"/goal_post",
//             data:{
//                 value_give:value,
//             },
//             success:function (response){
//             console.log(response)
//             window.location.reload();
//             }
//         })
//         tambah_tombol_goal();
//     }
// }

// //     } else {
// //     }
// // }

// // Menampilkan goal
// function goal_get() {
//     // Mengambil data dari server 
//     $.ajax({
//         type: "GET",
//         url: "/goal_get",
//         data: {},
//         success: function (response) {
//         // Menampilkan daftar budget di bagian bawah    
//         let value_goal = response['goals'][0].value;
//         $("#saving_goal_value").append(formatNumber(value_goal,'inc'))

//             }
//         })
// }


// function modal_goal_post(){
//     $("#id ").modal('show')
// }

// function goal_update(is_active) {
//     $.ajax({
//         type: "GET",
//         url: "/goal_update",
//         data: { is_active_get: is_active },
//         success: function (response) {
//             for(let i=0; i<response.goal.length; i++){
//                 if(num == response.goal[i].num){
//                     temp_modal_container = `
// DIUBAH
//                     `
//                     $(".content").append(temp_modal_container);
//                 }                
//             }
//         },
//     });
// }

// function update_budget_post(is_active) {
//     let desc =  $(".update-description").val();
//     let value = $(".update-value").val();
//     let budget_type = $( "#update_type option:selected" ).val();

//     $.ajax({
//         type: "POST",
//         url:"/budgetin/update/post",
//         data:{
//             num_give: num,
//             description_give: desc,
//             value_give: value,
//             type_give: budget_type
//         },
//         success:function (response){
//         console.log(response)
//         window.location.reload();
//         }
// })
// }




// // $(".input_btn").click(function () {
// // post_budget()
// // })
