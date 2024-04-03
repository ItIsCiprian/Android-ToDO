import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/**
 * Manages a list of tasks, allowing users to add, remove, and mark tasks as completed.
 * Tasks are persisted between sessions using SharedPreferences.
 */
public class MainActivity extends AppCompatActivity {

    // UI Components
    private EditText editTextTask; // Input field for new tasks
    private ListView listViewTasks; // Displays the list of tasks

    // Data
    private ArrayList<TaskItem> tasksList = new ArrayList<>(); // Stores tasks in memory
    private TaskAdapter tasksAdapter; // Adapter to bridge the tasksList and listViewTasks
    private SharedPreferences sharedPreferences; // For persistent storage of tasks

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialization steps
        initializeUserInterface();
        initializeEventListeners();
        loadTasks();
    }

    /**
     * Initializes UI components and binds data to the ListView.
     */
    private void initializeUserInterface() {
        // Setup SharedPreferences for task persistence
        sharedPreferences = getSharedPreferences("tasks", Context.MODE_PRIVATE);
        
        // Initialize UI components
        editTextTask = findViewById(R.id.editTextTask);
        listViewTasks = findViewById(R.id.listViewTasks);
        
        // Setup adapter and bind it to the ListView
        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);
    }

    /**
     * Sets up event listeners for UI interactions.
     */
    private void initializeEventListeners() {
        // Toggle task completion on item click
        listViewTasks.setOnItemClickListener((parent, view, position, id) -> {
            TaskItem task = tasksList.get(position);
            task.setCompleted(!task.isCompleted());
            tasksAdapter.notifyDataSetChanged();
            saveTasks();
        });

        // Remove task on long item click
        listViewTasks.setOnItemLongClickListener((parent, view, position, id) -> {
            tasksList.remove(position);
            tasksAdapter.notifyDataSetChanged();
            saveTasks();
            return true; // Indicate the click was handled
        });
    }

    /**
     * Adds a new task based on the input field's content when the add button is clicked.
     * Clears the input field after adding the task.
     * 
     * @param view The view that was clicked (the add button).
     */
    public void addTask(View view) {
        String taskName = editTextTask.getText().toString().trim();
        if (!taskName.isEmpty()) {
            tasksList.add(new TaskItem(taskName, false));
            tasksAdapter.notifyDataSetChanged();
            editTextTask.setText(""); // Clear input field
            saveTasks();
        }
    }

    /**
     * Persists the current list of tasks to SharedPreferences.
     */
    private void saveTasks() {
        Set<String> taskSet = new HashSet<>();
        for (TaskItem task : tasksList) {
            taskSet.add(task.getName() + ":" + task.isCompleted());
        }
        sharedPreferences.edit().putStringSet("tasks", taskSet).apply();
    }

    /**
     * Loads tasks from SharedPreferences into the task list.
     */
    private void loadTasks() {
        Set<String> taskSet = sharedPreferences.getStringSet("tasks", new HashSet<>());
        tasksList.clear(); // Prevent duplicate tasks
        for (String taskString : taskSet) {
            String[] parts = taskString.split(":");
            if (parts.length == 2) {
                tasksList.add(new TaskItem(parts[0], Boolean.parseBoolean(parts[1])));
            }
        }
        tasksAdapter.notifyDataSetChanged();
    }
}
