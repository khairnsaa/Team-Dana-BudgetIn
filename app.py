from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

client = MongoClient('mongodb+srv://ayam:ayam@cluster0.chzg4j4.mongodb.net/?retryWrites=true&w=majority')

db = client.dbbudgetin
app = Flask(__name__)

# Ngambil halaman
@app.route('/')
def budgetin():
    return render_template('index.html')

# Ngambil halaman login
# @app.route('/login')
# def login():
#     return render_template('login.html')

# Ambil informasi budget dari database
@app.route('/budgetin', methods=['GET'])
def budgetin_get():
    budget_list = list(db.budgetin.find({}, {'_id': False,'user_id': False}))
    return jsonify({'budget': budget_list})

# Menambahkan data dari form (dari client) ke server
@app.route("/budgetin", methods=["POST"])
def budgetin_post():
    # Mengambil data dari form (dari client)
    # date_receive = request.form['date_give'] #### Tanggal mungkin bisa dibikin otomatis
    type_receive = request.form['type_give']
    description_receive = request.form['description_give']
    value_receive = request.form['value_give']

    count = db.budgetin.count_documents({})
    num = count + 1

    # Mengumpulkan data menjadi 1 objek/array, mempermudah pengiriman
    doc = {
        'num' : num,
        # 'date': date_receive,
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