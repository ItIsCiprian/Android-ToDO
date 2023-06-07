import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class MainActivity extends AppCompatActivity {

    private ArrayList<TaskItem> tasksList;
    private TaskAdapter tasksAdapter;
    private EditText editTextTask;
    private ListView listViewTasks;
    private SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sharedPreferences = getSharedPreferences("tasks", Context.MODE_PRIVATE);

        editTextTask = findViewById(R.id.editTextTask);
        listViewTasks = findViewById(R.id.listViewTasks);

        tasksList = new ArrayList<>();
        tasksAdapter = new TaskAdapter(this, tasksList);
        listViewTasks.setAdapter(tasksAdapter);

        listViewTasks.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                CheckBox checkBox = view.findViewById(R.id.checkboxTask);
                checkBox.setChecked(!checkBox.isChecked());
                tasksList.get(position).setCompleted(checkBox.isChecked());
                saveTasksToSharedPreferences();
            }
        });

        listViewTasks.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                tasksList.remove(position);
                tasksAdapter.notifyDataSetChanged();
                saveTasksToSharedPreferences();
                return true;
            }
        });

        loadTasksFromSharedPreferences();
    }

    public void addTask(View view) {
        String taskName = editTextTask.getText().toString().trim();
        if (!taskName.isEmpty()) {
            TaskItem task = new TaskItem(taskName, false);
            tasksList.add(task);
            tasksAdapter.notifyDataSetChanged();
            editTextTask.setText("");
            saveTasksToSharedPreferences();
        }
    }

    private void saveTasksToSharedPreferences() {
        Set<String> taskSet = new HashSet<>();
        for (TaskItem task : tasksList) {
            taskSet.add(task.getName() + ":" + task.isCompleted());
        }
        sharedPreferences.edit().putStringSet("tasks", taskSet).apply();
    }

    private void loadTasksFromSharedPreferences() {
        Set<String> taskSet = sharedPreferences.getStringSet("tasks", new HashSet<String>());
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
