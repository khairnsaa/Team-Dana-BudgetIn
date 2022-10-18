from pymongo import MongoClient

client = MongoClient('mongodb+srv://ayam:ayam@cluster0.chzg4j4.mongodb.net/?retryWrites=true&w=majority')

db = client.dbbudgetin

list_db= list(db.budgetin.find().sort('num',-1))
highest_val= list_db[0]['num']
print(highest_val)
# sorted = list_db.sort()
# count = sorted[0]
# num = count + 1
# print(num)
