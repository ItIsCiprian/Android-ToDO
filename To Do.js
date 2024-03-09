import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity; // Use androidx library for compatibility
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/**
 * MainActivity class for managing a list of tasks.
 * Allows users to add, remove, and toggle the completion status of tasks.
 */
public class MainActivity extends AppCompatActivity {

    private ArrayList<TaskItem> tasksList; // Stores the tasks
    private TaskAdapter tasksAdapter; // Bridges the tasks list with the ListView UI
    private EditText editTextTask; // Input for new tasks
    private ListView listViewTasks; // Displays the tasks
    private SharedPreferences sharedPreferences; // For persisting task data

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initUI(); // Initialize the UI components
        initListeners(); // Setup listeners for task interactions
        loadTasksFromSharedPreferences(); // Load saved tasks
    }

    /**
     * Initializes UI components and shared preferences.
     */
    private void initUI() {
        sharedPreferences = getSharedPreferences("tasks", Context.MODE_PRIVATE);
        editTextTask = findViewById(R.id.editTextTask);
        listViewTasks = findViewById(R.id.listViewTasks);
        tasksList = new ArrayList<>();
        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);
    }

    /**
     * Sets up listeners for adding, removing, and toggling tasks.
     */
    private void initListeners() {
        listViewTasks.setOnItemClickListener((parent, view, position, id) -> {
            // Toggle the completion status of the clicked task
            TaskItem task = tasksList.get(position);
            task.setCompleted(!task.isCompleted());
            tasksAdapter.notifyDataSetChanged();
            saveTasksToSharedPreferences();
        });

        listViewTasks.setOnItemLongClickListener((parent, view, position, id) -> {
            // Remove the long-clicked task from the list
            tasksList.remove(position);
            tasksAdapter.notifyDataSetChanged();
            saveTasksToSharedPreferences();
            return true;
        });
    }

    /**
     * Adds a new task to the list when the add button is clicked.
     * @param view The view that was clicked.
     */
    public void addTask(View view) {
        String taskName = editTextTask.getText().toString().trim();
        if (!taskName.isEmpty()) {
            tasksList.add(new TaskItem(taskName, false));
            tasksAdapter.notifyDataSetChanged();
            editTextTask.setText(""); // Clear the input field
            saveTasksToSharedPreferences();
        }
    }

    /**
     * Saves the current list of tasks to SharedPreferences.
     */
    private void saveTasksToSharedPreferences() {
        Set<String> taskSet = new HashSet<>();
        for (TaskItem task : tasksList) {
            taskSet.add(task.getName() + ":" + task.isCompleted());
        }
        sharedPreferences.edit().putStringSet("tasks", taskSet).apply();
    }

    /**
     * Loads tasks from SharedPreferences and populates the task list.
     */
    private void loadTasksFromSharedPreferences() {
        Set<String> taskSet = sharedPreferences.getStringSet("tasks", new HashSet<>());
        tasksList.clear(); // Clear existing tasks to prevent duplicates
        for (String taskString : taskSet) {
            String[] parts = taskString.split(":");
            if (parts.length == 2) {
                tasksList.add(new TaskItem(parts[0], Boolean.parseBoolean(parts[1])));
            }
        }
        tasksAdapter.notifyDataSetChanged();
    }
}
