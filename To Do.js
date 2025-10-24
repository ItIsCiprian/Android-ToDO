// MainActivity.java
package your.package;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

/**
 * MainActivity manages a list of tasks with features to add, remove, and toggle completion status.
 * Tasks are persisted as a JSON array string in SharedPreferences to preserve order.
 */
public class MainActivity extends AppCompatActivity {

    private static final String PREFS_NAME = "tasks_prefs";
    private static final String KEY_TASKS_JSON = "tasks_json";

    private EditText editTextTask;
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
        listViewTasks = findViewById(R.id.listViewTasks);

        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);

        listViewTasks.setOnItemClickListener(this::onToggleTask);
        listViewTasks.setOnItemLongClickListener(this::onRemoveTask);

        loadTasks();
    }

    /** Add new task from EditText. Hook this to your button's onClick. */
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

    /** Toggle completion on tap. */
    private void onToggleTask(AdapterView<?> parent, View item, int position, long id) {
        TaskItem task = tasksList.get(position);
        task.toggleCompleted();
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
    }

    /** Remove on long-press. */
    private boolean onRemoveTask(AdapterView<?> parent, View view, int position, long id) {
        tasksList.remove(position);
        tasksAdapter.notifyDataSetChanged();
        saveTasks();
        return true;
    }

    /** Persist list as JSON array string (preserves order). */
    private void saveTasks() {
        JSONArray arr = new JSONArray();
        for (TaskItem t : tasksList) {
            arr.put(t.serialize()); // your existing format
        }
        prefs.edit().putString(KEY_TASKS_JSON, arr.toString()).apply();
    }

    /** Load list from JSON array string. */
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
            // If corrupt, reset
            prefs.edit().remove(KEY_TASKS_JSON).apply();
        }
        tasksAdapter.notifyDataSetChanged();
    }
}

