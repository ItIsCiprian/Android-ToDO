import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const TodoApp());
}

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter ToDo App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const TodoListScreen(),
    );
  }
}

class TodoListScreen extends StatefulWidget {
  const TodoListScreen({super.key});

  @override
  _TodoListScreenState createState() => _TodoListScreenState();
}

class _TodoListScreenState extends State<TodoListScreen> {
  final List<Map<String, dynamic>> _todoList = [];
  late SharedPreferences _prefs;

  @override
  void initState() {
    super.initState();
    _loadTodoItems();
  }

  Future<void> _loadTodoItems() async {
    _prefs = await SharedPreferences.getInstance();
    List<String> todoListString = _prefs.getStringList('todoList') ?? [];
    setState(() {
      _todoList.clear();
      for (String item in todoListString) {
        _todoList.add(Map<String, dynamic>.from(json.decode(item)));
      }
    });
  }

  Future<void> _saveTodoItems() async {
    List<String> todoListString = [];
    for (Map<String, dynamic> item in _todoList) {
      todoListString.add(json.encode(item));
    }
    await _prefs.setStringList('todoList', todoListString);
  }

  void _addTodoItem(String title) {
    setState(() {
      _todoList.add({'title': title, 'completed': false});
    });
    _saveTodoItems();
  }

  void _toggleTodoCompletion(int index) {
    setState(() {
      _todoList[index]['completed'] = !_todoList[index]['completed'];
    });
    _saveTodoItems();
  }

  void _removeTodoItem(int index) {
    setState(() {
      _todoList.removeAt(index);
    });
    _saveTodoItems();
  }

  void _showAddTodoDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        String newTodo = "";
        return AlertDialog(
          title: const Text('Add a new ToDo'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                TextField(
                  autofocus: true,
                  onChanged: (value) {
                    newTodo = value;
                  },
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Add'),
              onPressed: () {
                _addTodoItem(newTodo);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ToDo List'),
      ),
      body: ListView.builder(
        itemCount: _todoList.length,
        itemBuilder: (context, index) {
          return Dismissible(
            key: Key(_todoList[index]['title']),
            onDismissed: (direction) {
              _removeTodoItem(index);
            },
            background: Container(color: Colors.red),
            child: ListTile(
              title: Text(
                _todoList[index]['title'],
                style: TextStyle(
                  decoration: _todoList[index]['completed']
                      ? TextDecoration.lineThrough
                      : null,
                ),
              ),
              onTap: () {
                _toggleTodoCompletion(index);
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddTodoDialog,
        tooltip: 'Add ToDo',
        child: const Icon(Icons.add),
      ),
    );
  }
}