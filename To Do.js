import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/**
 * Main activity class for managing tasks in a list.
 * Users can add, remove, and mark tasks as completed.
 */
public class MainActivity extends AppCompatActivity {

    // List to store tasks
    private ArrayList<TaskItem> tasksList;

    // Adapter to bridge tasks list and ListView UI component
    private TaskAdapter tasksAdapter;

    // UI component for entering new tasks
    private EditText editTextTask;

    // ListView UI component for displaying tasks
    private ListView listViewTasks;

    // Shared preferences for persisting tasks data
    private SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize shared preferences
        sharedPreferences = getSharedPreferences("tasks", Context.MODE_PRIVATE);

        // Link UI components
        editTextTask = findViewById(R.id.editTextTask);
        listViewTasks = findViewById(R.id.listViewTasks);

        // Initialize tasks list and adapter
        tasksList = new ArrayList<>();
        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);

        // Set item click listener for marking tasks as completed
        listViewTasks.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                // Toggle the completed state of the task
                TaskItem task = tasksList.get(position);
                task.setCompleted(!task.isCompleted());
                tasksAdapter.notifyDataSetChanged();
                saveTasksToSharedPreferences();
            }
        });

        // Set item long click listener for removing tasks
        listViewTasks.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                // Remove the task from the list
                tasksList.remove(position);
                tasksAdapter.notifyDataSetChanged();
                saveTasksToSharedPreferences();
                return true;
            }
        });

        // Load previously saved tasks
        loadTasksFromSharedPreferences();
    }

    /**
     * Called when the user taps the add button to add a new task.
     * @param view The view that was clicked.
     */
    public void addTask(View view) {
        String taskName = editTextTask.getText().toString().trim();
        if (!taskName.isEmpty()) {
            TaskItem task = new TaskItem(taskName, false);
            tasksList.add(task);
            tasksAdapter.notifyDataSetChanged();
            editTextTask.setText(""); // Clear input field
            saveTasksToSharedPreferences();
        }
    }

    /**
     * Saves the current list of tasks to shared preferences.
     */
    private void saveTasksToSharedPreferences() {
        Set<String> taskSet = new HashSet<>();
        for (TaskItem task : tasksList) {
            taskSet.add(task.getName() + ":" + task.isCompleted());
        }
        sharedPreferences.edit().putStringSet("tasks", taskSet).apply();
    }

    /**
     * Loads tasks from shared preferences and populates the task list.
     */
    private void loadTasksFromSharedPreferences() {
        Set<String> taskSet = sharedPreferences.getStringSet("tasks", new HashSet<String>());
        tasksList.clear(); // Clear existing tasks to prevent duplicates
        for (String taskString : taskSet) {
            String[] parts = taskString.split(":");
            if (parts.length == 2) {
                String name = parts[0];
                boolean completed = Boolean.parseBoolean(parts[1]);
                TaskItem task = new TaskItem(name, completed);
                tasksList.add(task);
            }
        }
        tasksAdapter.notifyDataSetChanged();
    }
}
