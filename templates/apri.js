// Fungsi baru berjalan ketika dokumen selesai loading
$(document).ready(function () {
    show_budget();
    save_budget();
    update_budget();
    delete_budget();
    });

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
        let rows = response["budget"];
            for (let i = 0; i < rows.length; i++) {
              if (row[i]['type'] === 'inc'){
                  let num = rows[i]["num"];
                  let date = rows[i]["date"];
                  let type = rows[i]["type"];
                  let description = rows[i]["description"];
                  let value = rows[i]["value"];
              }




              if (done === 0) {
                temp_html = `
        <li>
            <h2>✅ ${bucket}</h2>
            <button onclick="done_bucket(${num})" type="button" class="btn btn-outline-primary">Mark as complete</button>
        </li>
                            `;
              } else {
                temp_html = `
        <li>
            <h2 class="done">✅ ${bucket}</h2>
            <button onclick="undo_bucket(${num})" type="button" class="btn btn-outline-danger">Cancel</button>
        </li>
                            `;
              }
              $("#bucket-list").append(temp_html);
            }
          },
        });
      }
      function add_budget() {
        let bucket = $("#bucket").val();
        $.ajax({
          type: "POST",
          url: "/bucket",
          data: { bucket_give: bucket },
          success: function (response) {
            //alert(response["msg"]);
            window.location.reload();
          },
        });
      }
      function update_budget(num) {
        $.ajax({
          type: "POST",
          url: "/bucket/done",
          data: { num_give: num },
          success: function (response) {
            //alert(response["msg"]);
            window.location.reload();
          },
        });
      }
      function delete_budget(num) {
        $.ajax({
          type: "POST",
          url: "/bucket/undo",
          data: { num_give: num },
          success: function (response) {
            //alert(response["msg"]);
            window.location.reload();
          },
        });
      }

      