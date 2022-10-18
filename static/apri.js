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
        let rows = response["budgets"];
            for (let i = 0; i < rows.length; i++) {
              if (rows[i]['type'] === 'inc'){
                  let num = rows[i]["num"];
                  let date = rows[i]["date"];
                  let description = rows[i]["description"];
                  let value = rows[i]["value"];

                  temp_html_income = `
                  <div class="item" id="income-${num}">
                    <div class="item-date">${date}</div>
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
                    <div class="item-date">${date}</div>
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
    data: { num_give: num },
    success: function (response) {
    //alert(response["msg"]);
    window.location.reload();
    },
});
}

    //   function update_budget(num) {
    //     $.ajax({
    //       type: "POST",
    //       url: "/bucket/done",
    //       data: { num_give: num },
    //       success: function (response) {
    //         //alert(response["msg"]);
    //         window.location.reload();
    //       },
    //     });
    //   }
    //   

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
        }
})
window.location.reload();
}

$(".input_btn").click(function () {
console.log("save")
post_budget()
})

      