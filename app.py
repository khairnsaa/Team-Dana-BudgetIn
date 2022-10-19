from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import time

client = MongoClient('mongodb+srv://ayam:ayam@cluster0.chzg4j4.mongodb.net/?retryWrites=true&w=majority')

db = client.dbbudgetin
app = Flask(__name__)

# Ngambil halaman
@app.route('/')
def home():
    return render_template('index.html')

# Ngambil halaman login
# @app.route('/login')
# def login():
#     return render_template('login.html')

# Ambil informasi budget dari database
@app.route('/budgetin', methods=['GET'])
def budgetin_get():
    # Ngambil data, tunjukin di kolom bawah.
    budget_list = list(db.budgetin.find({}, {'_id': False}))
    # Ngambil data, tunjukin di kolom atas.
    # Mengambil informasi value dari semua data
    total_income_list = list(db.budgetin.find({'type': 'inc'},{'_id': False,'num': False,'date': False,'description':False,'type':False}))
    total_expense_list = list(db.budgetin.find({'type': 'exp'},{'_id': False,'num': False,'date': False,'description':False,'type':False})) 

    # Iterasi menjumlahkan total income dan total expense
    i = 0
    final_income=0
    while i < len(total_income_list): 
        final_income = final_income + int(total_income_list[i]['value'])
        i=i+1
    i = 0
    final_expense=0
    while i < len(total_expense_list): 
        final_expense = final_expense + int(total_expense_list[i]['value'])
        i=i+1
    total_budget=final_income-final_expense
    kolom_atas = {'final_income':final_income,'final_expense':final_expense,'total_budget':total_budget}

    return jsonify({'budgets': budget_list,'kolom_atas': kolom_atas})

# Menambahkan data dari form (dari client) ke server
@app.route("/budgetin/post", methods=["POST"])
def budgetin_post():
    # Mengambil data dari form (dari client)
    # date_receive = request.form['date_give'] #### Tanggal mungkin bisa dibikin otomatis
    type_receive = request.form['type_give']
    description_receive = request.form['description_give']
    value_receive = request.form['value_give']

    # Kalau dokumen kosong, indeksnya dikasih 1. 
    # Kalau berisi, dicari yang tertinggi dan numnya 1 angka lebih tinggi.
    if db.budgetin.count_documents({}) != 0:
        list_db= list(db.budgetin.find().sort('num',-1))
        highest_val= list_db[0]['num']
        num = highest_val + 1
    else:
         num = 1
    
    # Mengumpulkan data menjadi 1 objek/array, mempermudah pengiriman
    doc = {
        'num' : num,
        'date': int(time.time()),
        'type': type_receive,
        'description': description_receive,
        'value' : value_receive
    }

    # Menambahkan data ke database
    db.budgetin.insert_one(doc)
    return jsonify({'msg': 'Data added!'})

# Mengubah informasi budget yang ada.
@app.route("/budgetin/update", methods=["POST"])
def budgetin_update():
    # Mengambil data dari client
    num_receive = request.form['num_give']
    date_receive = request.form['date_give']
    type_receive = request.form['type_give']
    description_receive = request.form['description_give']
    value_receive = request.form['value_give']

    # Memasukkan data ke server
    db.budgetin.update_one(
    {'num':num_receive}, 
    {'$set': {'date': int(date_receive),
        'type': int(type_receive),
        'description': int(description_receive),
        'value': int(value_receive)},}
    )
    return jsonify({'msg': 'update done!'})

# Menghapus informasi budget dari database
@app.route("/delete", methods=["POST"])
def delete_budget():
    num_receive = request.form['num_give']
    db.budgetin.delete_one({'num': int(num_receive)})
    return jsonify({'msg': 'delete done!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)