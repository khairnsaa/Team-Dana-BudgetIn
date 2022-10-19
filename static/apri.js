// Fungsi baru berjalan ketika dokumen selesai loading
$(document).ready(function () {
    show_budget();
    // update_budget();
    delete_budget();
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
    
    return `${type === 'inc' ? '+' : '-'} ${rupiah}` 
}

// Mengubah tanggal dari timestamp menjadi tanggal biasanya
function date_convert(date){
    var d = new Date(date*1000);
    return d.toDateString()
}


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
        $("#total_budget").append(response["kolom_atas"]['total_budget'])
        $("#final_income").append(response["kolom_atas"]['final_income'])
        $("#final_expense").append(response["kolom_atas"]['final_expense'])

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
                    <div class="item-date">${date_convert(date)}</div>
                    <div class="item-description">${description}</div>
                        <div class="value-cta">
                            <div class="item-value">${formatNumber(value, 'inc')}</div>
                            <div class="item-delete-update">
                                <button onclick="update_budget(${num})"><i class="fas fa-edit"></i></button>
                                <button onclick="delete_budget(${num})"><i class="fas fa-times"></i></button>
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
                    <div class="item-date">${date_convert(date)}</div>
                    <div class="item-description">${description}</div>
                        <div class="value-cta">
                            <div class="item-value">${formatNumber(value, 'inc')}</div>
                            <div class="item-delete-update">
                                <button onclick="update_budget(${num})"><i class="fas fa-edit"></i></button>
                                <button onclick="delete_budget(${num})"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                  </div>
                  `
                  $("#expense-list").append(temp_html_expense);
                }}}
    })
}

function delete_budget(num) {
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

function hide_modal(){
    $(".modal-container").hide();
}

function update_budget(num) {
    $.ajax({
        type: "GET",
        url: "/budgetin",
        data: { num_give: num },
        success: function (response) {
            console.log(response);
            // window.location.reload();
        },
    });
    temp_modal_container = `
    <div class="modal-container">
        <div class="modal-card">
            <div class="update-budget">
            <div class="update_type">
                <select class="budget_type">
                <option value="inc">+</option>
                <option value="exp">-</option>
                </select>
            </div>
            <input
                type="text"
                class="update-description"
                value=""
                placeholder="Add Description"
            />
            <input
                type="number"
                class="update-value"
                value=""
                placeholder="Value"
            />
            <button class="update_btn"><i class="fas fa-check"></i></button>
            <button class="update_btn update_btn-delete" onclick="hide_modal()"><i class="fas fa-times"></i></button>
            </div>
        </div>
    </div>
    `
    $(".content").append(temp_modal_container);
}

function post_budget() {
    let desc =  $(".input-description").val();
    let value = $(".input-value").val();
    let budget_type = $( ".budget_type option:selected" ).val()
    console.log(desc)
    console.log(value)
    console.log(budget_type)
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
        window.location.reload();
        }
})
}

$(".input_btn").click(function () {
console.log("save")
post_budget()
})

      