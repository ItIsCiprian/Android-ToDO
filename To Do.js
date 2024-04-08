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
 * MainActivity that manages a list of tasks, enabling users to add, remove, and toggle the completion status of tasks.
 * It utilizes SharedPreferences to persist tasks between sessions, ensuring that user data is retained across app launches.
 */
public class MainActivity extends AppCompatActivity {

    // UI Components
    private EditText editTextTask; // EditText for entering new tasks.
    private ListView listViewTasks; // ListView to display tasks.

    // Adapter and Data
    private ArrayList<TaskItem> tasksList = new ArrayList<>(); // Holds task items.
    private TaskAdapter tasksAdapter; // Adapter to connect tasksList with listViewTasks.

    // SharedPreferences for persisting tasks
    private SharedPreferences sharedPreferences; // Storage for tasks.

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize UI components and setup
        initUI();
        setupListeners();
        loadTasksFromPreferences();
    }

    /**
     * Initializes UI components and sets up the task adapter for the ListView.
     */
    private void initUI() {
        sharedPreferences = getSharedPreferences("tasks", Context.MODE_PRIVATE);
        
        editTextTask = findViewById(R.id.editTextTask);
        listViewTasks = findViewById(R.id.listViewTasks);

        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);
    }

    /**
     * Configures event listeners for user interactions with the task list.
     */
    private void setupListeners() {
        // Mark task as completed/not completed on item click.
        listViewTasks.setOnItemClickListener((parent, view, position, id) -> {
            TaskItem task = tasksList.get(position);
            task.toggleCompleted();
            tasksAdapter.notifyDataSetChanged();
            saveTasksToPreferences();
        });

        // Remove task on long press.
        listViewTasks.setOnItemLongClickListener((parent, view, position, id) -> {
            tasksList.remove(position);
            tasksAdapter.notifyDataSetChanged();
            saveTasksToPreferences();
            return true; // Event consumed.
        });
    }

    /**
     * Adds a new task from the EditText to the task list, then saves and refreshes the list.
     * @param view The view that triggered this method (add button).
     */
    public void onAddTaskClicked(View view) {
        String taskName = editTextTask.getText().toString().trim();
        if (!taskName.isEmpty()) {
            TaskItem newTask = new TaskItem(taskName, false);
            tasksList.add(newTask);
            tasksAdapter.notifyDataSetChanged();
            editTextTask.setText(""); // Clear the input field after adding.
            saveTasksToPreferences();
        }
    }

    /**
     * Saves the current tasks to SharedPreferences.
     */
    private void saveTasksToPreferences() {
        Set<String> tasksSet = new HashSet<>();
        for (TaskItem task : tasksList) {
            tasksSet.add(task.serialize());
        }
        sharedPreferences.edit().putStringSet("tasks", tasksSet).apply();
    }

    /**
     * Loads tasks from SharedPreferences into the tasks list.
     */
    private void loadTasksFromPreferences() {
        Set<String> tasksSet = sharedPreferences.getStringSet("tasks", new HashSet<>());
        tasksList.clear(); // Clear existing data to avoid duplicates.
        for (String serializedTask : tasksSet) {
            TaskItem task = TaskItem.deserialize(serializedTask);
            if (task != null) {
                tasksList.add(task);
            }
        }
        tasksAdapter.notifyDataSetChanged();
    }
}
