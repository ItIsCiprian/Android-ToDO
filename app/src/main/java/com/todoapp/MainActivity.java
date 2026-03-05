package com.todoapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private static final String PREFS_NAME = "tasks_prefs";
    private static final String KEY_TASKS_JSON = "tasks_json";

    private EditText editTextTask;
    private MaterialButton buttonAddTask;
    private FloatingActionButton fabAddTask;
    private RecyclerView recyclerViewTasks;
    private TextView summaryTextView;

    private final ArrayList<TaskItem> tasksList = new ArrayList<>();
    private TaskAdapter tasksAdapter;

    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        initializeViews();
        setupRecyclerView();
        setupClickListeners();
        loadTasks();
        updateSummary();
    }

    private void initializeViews() {
        editTextTask = findViewById(R.id.editTextTask);
        buttonAddTask = findViewById(R.id.buttonAddTask);
        fabAddTask = findViewById(R.id.fabAddTask);
        recyclerViewTasks = findViewById(R.id.listViewTasks);
        summaryTextView = findViewById(R.id.textViewSummary);
    }

    private void setupRecyclerView() {
        tasksAdapter = new TaskAdapter(this, tasksList);
        recyclerViewTasks.setLayoutManager(new LinearLayoutManager(this));
        recyclerViewTasks.setAdapter(tasksAdapter);

        tasksAdapter.setOnItemClickListener(new TaskAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(int position) {
                onToggleTask(position);
            }

            @Override
            public void onItemLongClick(int position) {
                onRemoveTask(position);
            }
        });
    }

    private void setupClickListeners() {
        buttonAddTask.setOnClickListener(this::onAddTaskClicked);
        fabAddTask.setOnClickListener(this::onAddTaskClicked);
        
        // Also add task when user presses "Done" on keyboard
        editTextTask.setOnEditorActionListener((v, actionId, event) -> {
            onAddTaskClicked(v);
            return true;
        });
    }

    public void onAddTaskClicked(View view) {
        final String raw = editTextTask.getText().toString();
        final String taskName = raw == null ? "" : raw.trim();
        if (taskName.isEmpty()) {
            Toast.makeText(this, R.string.empty_task_message, Toast.LENGTH_SHORT).show();
            return;
        }
        
        // Add task and re-sort to keep high-priority, incomplete tasks at the top
        tasksList.add(new TaskItem(taskName, false));
        resortTasks();
        tasksAdapter.notifyDataSetChanged();

        // Clear input and scroll to the top where the most relevant tasks are
        editTextTask.setText("");
        recyclerViewTasks.scrollToPosition(0);
        saveTasks();
        updateSummary();
    }

    private void onToggleTask(int position) {
        TaskItem task = tasksList.get(position);
        task.toggleCompleted();
        resortTasks();
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
        updateSummary();
    }

    private void onRemoveTask(int position) {
        tasksList.remove(position);
        resortTasks();
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
        updateSummary();
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
        resortTasks();
        tasksAdapter.notifyDataSetChanged();
        updateSummary();
    }

    private void updateSummary() {
        if (summaryTextView == null) {
            return;
        }
        int total = tasksList.size();
        if (total == 0) {
            summaryTextView.setText(R.string.no_tasks);
            return;
        }
        int completed = 0;
        for (TaskItem task : tasksList) {
            if (task.isCompleted()) {
                completed++;
            }
        }
        String summary = getString(R.string.summary_format, completed, total);
        summaryTextView.setText(summary);
    }

    private void resortTasks() {
        java.util.Collections.sort(tasksList, (a, b) -> {
            // Incomplete tasks first
            if (a.isCompleted() != b.isCompleted()) {
                return a.isCompleted() ? 1 : -1;
            }
            // Higher priority first
            if (a.getPriority() != b.getPriority()) {
                return Integer.compare(b.getPriority(), a.getPriority());
            }
            // Fallback: alphabetical
            return a.getTaskName().compareToIgnoreCase(b.getTaskName());
        });
    }
}