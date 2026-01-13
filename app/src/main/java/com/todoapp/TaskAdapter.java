package com.todoapp;

import android.content.Context;
import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;

public class TaskAdapter extends ArrayAdapter<TaskItem> {
    private final Context context;
    private final ArrayList<TaskItem> tasks;

    public TaskAdapter(Context context, ArrayList<TaskItem> tasks) {
        super(context, 0, tasks);
        this.context = context;
        this.tasks = tasks;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        View listItemView = convertView;
        if (listItemView == null) {
            listItemView = LayoutInflater.from(context).inflate(R.layout.task_item, parent, false);
        }

        TaskItem currentTask = tasks.get(position);

        TextView taskTextView = listItemView.findViewById(R.id.textViewTask);
        taskTextView.setText(currentTask.getTaskName());

        if (currentTask.isCompleted()) {
            taskTextView.setPaintFlags(taskTextView.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            taskTextView.setTextColor(context.getResources().getColor(android.R.color.darker_gray));
        } else {
            taskTextView.setPaintFlags(taskTextView.getPaintFlags() & (~Paint.STRIKE_THRU_TEXT_FLAG));
            taskTextView.setTextColor(context.getResources().getColor(android.R.color.black));
        }

        return listItemView;
    }
}