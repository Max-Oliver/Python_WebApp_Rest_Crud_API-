from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

# Here i tried to install dotenv but it having problems with the start application server, 
# just breake up the initialitation of the server

# settings.py
# import os
# USER_DB = os.getenv("USER")
# PASS = os.getenv("PASS")
# DB   = os.getenv("DB")

# This vars should be secure not upload on github.. ( |¨| > |¨|)
USER_DB='Note'
PASS='lada'
DB='re'

# We instance the app server
app = Flask(__name__)
# Configure the conection to the database on this case mongo db
app.config['MONGO_URI']= f'mongodb+srv://{USER_DB}:{PASS}@{DB}-tdiem.gcp.mongodb.net/test?retryWrites=true&w=majority'
mongo = PyMongo(app)

db = mongo.db.users

# we configure the server to allow from each origin. CORS
CORS(app)

@app.route('/users', methods=['POST'])
def createUser():
      id = db.insert({
            'name': request.json['name'],
            'email': request.json['email'],
            'password': request.json['password']     
      })
      return jsonify(str(ObjectId(id)))

@app.route('/users', methods=['GET'])
def get_users():
      users = []
      for doc in db.find():
            users.append({
                  '_id': str(ObjectId(doc['_id'])),
                  'name': doc['name'],
                  'email': doc['email'],
                  'password': doc['password']
            })
      
      return jsonify(users);


@app.route('/users/<id>', methods=['GET'])
def get_user(id):
      user = db.find_one({'_id': ObjectId(id)})
      return jsonify({
            '_id': str(ObjectId(user['_id'])),
            'name': user['name'],
            'email': user['email'],
            'password': user['password']
      })

@app.route('/users/<id>', methods=['PUT'])
def update_user(id):
      user = db.update_one({'_id': ObjectId(id)}, {'$set': {
            'name': request.json['name'],
            'email': request.json['email'],
            'password': request.json['password']
      }})
      return jsonify({'msj':'User updated'})
      return 

@app.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
      db.delete_one({'_id': ObjectId(id)})
      return jsonify({'msj':'User deleted successfully..'})


if __name__ == "__main__":
      app.run(debug=True, port=4000)
