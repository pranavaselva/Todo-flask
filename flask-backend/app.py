from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Connect to MongoDB
client = MongoClient('mongodb+srv://selva:selva009@cluster0.fcr8ppg.mongodb.net/')
db = client['todo_db']  
todos_collection = db['todos'] 

# Helper to convert MongoDB ObjectId to string
def todo_serializer(todo):
    return {
        'id': str(todo['_id']),
        'title': todo['title'],
        'completed': todo['completed']
    }

# Get all todos
@app.route('/todos', methods=['GET'])
def get_todos():
    todos = list(todos_collection.find())
    return jsonify([todo_serializer(todo) for todo in todos])

# Add a new todo
@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.json
    todo_id = todos_collection.insert_one({
        'title': data['title'],
        'completed': False
    }).inserted_id
    return jsonify({'id': str(todo_id)})

# Update a todo
@app.route('/todos/<id>', methods=['PUT'])
def update_todo(id):
    data = request.json
    todos_collection.update_one(
        {'_id': ObjectId(id)},
        {'$set': {'title': data['title'], 'completed': data['completed']}}
    )
    return jsonify({'message': 'Todo updated'})

# Delete a todo
@app.route('/todos/<id>', methods=['DELETE'])
def delete_todo(id):
    todos_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Todo deleted'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)