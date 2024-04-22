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
 * MainActivity manages a list of tasks with features to add, remove, and toggle completion status.
 * It uses SharedPreferences to persist tasks across app launches.
 */
public class MainActivity extends AppCompatActivity {

    private EditText editTextTask; // Input field for new tasks.
    private ListView listViewTasks; // Displays tasks.

    private ArrayList<TaskItem> tasksList = new ArrayList<>(); // List of tasks.
    private TaskAdapter tasksAdapter; // Adapter to link tasksList with listViewTasks.

    private SharedPreferences sharedPreferences; // SharedPreferences to store tasks persistently.

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeComponents();
        configureEventListeners();
        loadTasks();
    }

    /**
     * Initializes the UI components and sets up the adapter for the ListView.
     */
    private void initializeComponents() {
        sharedPreferences = getSharedPreferences("tasks", Context.MODE_PRIVATE);
        
        editTextTask = findViewById(R.id.editTextTask);
        listViewTasks = findViewById(R.id.listViewTasks);

        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);
    }

    /**
     * Sets up event listeners for UI interactions.
     */
    private void configureEventListeners() {
        listViewTasks.setOnItemClickListener(this::toggleTaskCompletion);
        listViewTasks.setOnItemLongClickListener(this::removeTask);
    }

    /**
     * Toggles the completion status of the task when an item is clicked.
     */
    private void toggleTaskCompletion(AdapterView<?> parent, View view, int position, long id) {
        TaskItem task = tasksList.get(position);
        task.toggleCompleted();
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
    }

    /**
     * Removes a task from the list on a long press.
     */
    private boolean removeTask(AdapterView<?> parent, View view, int position, long id) {
        tasksList.remove(position);
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
        return true; // Indicates the event was handled.
    }

    /**
     * Adds a new task from the EditText into the tasks list.
     */
    public void onAddTaskClicked(View view) {
        String taskName = editTextTask.getText().toString().trim();
        if (!taskName.isEmpty()) {
            tasksList.add(new TaskItem(taskName, false));
            tasksAdapter.notifyDataSetChanged();
            editTextTask.setText(""); // Clears the input field.
            saveTasks();
        }
    }

    /**
     * Saves the current list of tasks to SharedPreferences.
     */
    private void saveTasks() {
        Set<String> tasksSet = new HashSet<>();
        for (TaskItem task : tasksList) {
            tasksSet.add(task.serialize());
        }
        sharedPreferences.edit().putStringSet("tasks", tasksSet).apply();
    }

    /**
     * Loads tasks from SharedPreferences into the task list.
     */
    private void loadTasks() {
        Set<String> storedTasks = sharedPreferences.getStringSet("tasks", new HashSet<>());
        tasksList.clear();
        for (String serializedTask : storedTasks) {
            TaskItem task = TaskItem.deserialize(serializedTask);
            tasksList.add(task);
        }
        tasksAdapter.notifyDataSetChanged();
    }
}
