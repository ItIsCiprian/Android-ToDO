// main.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(const TodoApp());

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter ToDo',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.blue),
      home: const TodoListScreen(),
    );
  }
}

class TodoItem {
  final String id;
  final String title;
  final bool completed;

  const TodoItem({required this.id, required this.title, this.completed = false});

  TodoItem copyWith({String? id, String? title, bool? completed}) => TodoItem(
        id: id ?? this.id,
        title: title ?? this.title,
        completed: completed ?? this.completed,
      );

  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'completed': completed};
  factory TodoItem.fromMap(Map<String, dynamic> m) =>
      TodoItem(id: m['id'] as String, title: m['title'] as String, completed: m['completed'] as bool);
}

class TodoStorage {
  static const _key = 'todoList_v2';

  Future<List<TodoItem>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList(_key) ?? <String>[];
    return raw
        .map((s) => Map<String, dynamic>.from(json.decode(s)))
        .map(TodoItem.fromMap)
        .toList(growable: false);
  }

  Future<void> save(List<TodoItem> items) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = items.map((e) => json.encode(e.toMap())).toList(growable: false);
    await prefs.setStringList(_key, raw);
  }
}

class TodoListScreen extends StatefulWidget {
  const TodoListScreen({super.key});
  @override
  State<TodoListScreen> createState() => _TodoListScreenState();
}

class _TodoListScreenState extends State<TodoListScreen> {
  final _items = <TodoItem>[];
  final _storage = TodoStorage();

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    final loaded = await _storage.load();
    setState(() {
      _items
        ..clear()
        ..addAll(loaded);
    });
  }

  Future<void> _persist() => _storage.save(_items);

  Future<void> _add(String title) async {
    final t = title.trim();
    if (t.isEmpty) return;
    setState(() {
      _items.add(TodoItem(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        title: t,
      ));
    });
    await _persist();
  }

  Future<void> _toggle(int index) async {
    setState(() {
      _items[index] = _items[index].copyWith(completed: !_items[index].completed);
    });
    await _persist();
  }

  Future<void> _removeAt(int index) async {
    setState(() {
      _items.removeAt(index);
    });
    await _persist();
  }

  void _showAddDialog() {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add a new ToDo'),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          onSubmitted: (_) {
            Navigator.of(context).pop();
            _add(ctrl.text);
          },
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              Navigator.of(context).pop();
              _add(ctrl.text);
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasItems = _items.isNotEmpty;
    return Scaffold(
      appBar: AppBar(title: const Text('ToDo List')),
      body: hasItems
          ? ListView.separated(
              itemCount: _items.length,
              separatorBuilder: (_, __) => const Divider(height: 1),
              itemBuilder: (context, index) {
                final item = _items[index];
                return Dismissible(
                  key: ValueKey(item.id),
                  background: Container(color: Colors.red),
                  onDismissed: (_) => _removeAt(index),
                  child: CheckboxListTile(
                    value: item.completed,
                    onChanged: (_) => _toggle(index),
                    title: Text(
                      item.title,
                      style: TextStyle(
                        decoration: item.completed ? TextDecoration.lineThrough : TextDecoration.none,
                        color: item.completed ? Colors.grey : null,
                      ),
                    ),
                  ),
                );
              },
            )
          : const Center(child: Text('No items yet. Tap + to add one.')),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddDialog,
        tooltip: 'Add ToDo',
        child: const Icon(Icons.add),
      ),
    );
  }
}
