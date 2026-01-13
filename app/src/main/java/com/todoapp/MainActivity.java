package com.todoapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private static final String PREFS_NAME = "tasks_prefs";
    private static final String KEY_TASKS_JSON = "tasks_json";

    private EditText editTextTask;
    private Button buttonAddTask;
    private ListView listViewTasks;

    private final ArrayList<TaskItem> tasksList = new ArrayList<>();
    private TaskAdapter tasksAdapter;

    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        editTextTask = findViewById(R.id.editTextTask);
        buttonAddTask = findViewById(R.id.buttonAddTask);
        listViewTasks = findViewById(R.id.listViewTasks);

        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);

        listViewTasks.setOnItemClickListener(this::onToggleTask);
        listViewTasks.setOnItemLongClickListener(this::onRemoveTask);

        buttonAddTask.setOnClickListener(this::onAddTaskClicked);

        loadTasks();
    }

    public void onAddTaskClicked(View view) {
        final String raw = editTextTask.getText().toString();
        final String taskName = raw == null ? "" : raw.trim();
        if (taskName.isEmpty()) {
            Toast.makeText(this, "Please enter a task", Toast.LENGTH_SHORT).show();
            return;
        }
        tasksList.add(new TaskItem(taskName, false));
        tasksAdapter.notifyDataSetChanged();
        editTextTask.setText("");
        saveTasks();
    }

    private void onToggleTask(AdapterView<?> parent, View item, int position, long id) {
        TaskItem task = tasksList.get(position);
        task.toggleCompleted();
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
    }

    private boolean onRemoveTask(AdapterView<?> parent, View view, int position, long id) {
        tasksList.remove(position);
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
        return true;
    }

    private void saveTasks() {
        JSONArray arr = new JSONArray();
        for (TaskItem t : tasksList) {
            arr.put(t.serialize());
        }
        prefs.edit().putString(KEY_TASKS_JSON, arr.toString()).apply();
    }

    private void loadTasks() {
        tasksList.clear();
        String json = prefs.getString(KEY_TASKS_JSON, "[]");
        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                String serialized = arr.optString(i, null);
                if (serialized != null) {
                    TaskItem t = TaskItem.deserialize(serialized);
                    if (t != null) tasksList.add(t);
                }
            }
        } catch (JSONException e) {
            prefs.edit().remove(KEY_TASKS_JSON).apply();
        }
        tasksAdapter.notifyDataSetChanged();
    }
}