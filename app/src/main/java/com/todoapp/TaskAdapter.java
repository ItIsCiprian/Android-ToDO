package com.todoapp;

import android.content.Context;
import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.card.MaterialCardView;

import java.util.ArrayList;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.TaskViewHolder> {
    private final Context context;
    private final ArrayList<TaskItem> tasks;
    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(int position);
        void onItemLongClick(int position);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    public TaskAdapter(Context context, ArrayList<TaskItem> tasks) {
        this.context = context;
        this.tasks = tasks;
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.task_item, parent, false);
        return new TaskViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder holder, int position) {
        TaskItem currentTask = tasks.get(position);
        
        holder.taskTextView.setText(currentTask.getTaskName());
        
        // Update task appearance based on completion status
        if (currentTask.isCompleted()) {
            holder.taskTextView.setPaintFlags(holder.taskTextView.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            holder.taskTextView.setTextColor(context.getResources().getColor(R.color.task_completed_text));
            holder.checkIndicator.setSelected(true);
            holder.cardView.setAlpha(0.7f);
        } else {
            holder.taskTextView.setPaintFlags(holder.taskTextView.getPaintFlags() & (~Paint.STRIKE_THRU_TEXT_FLAG));
            holder.taskTextView.setTextColor(context.getResources().getColor(R.color.on_surface));
            holder.checkIndicator.setSelected(false);
            holder.cardView.setAlpha(1.0f);
        }

        // Set click listeners with ripple effect
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(holder.getAdapterPosition());
            }
        });

        holder.itemView.setOnLongClickListener(v -> {
            if (listener != null) {
                listener.onItemLongClick(holder.getAdapterPosition());
            }
            return true;
        });

        // Set priority indicator
        int priority = currentTask.getPriority();
        if (priority > 0) {
            holder.priorityIndicator.setVisibility(View.VISIBLE);
            switch (priority) {
                case 1:
                    holder.priorityIndicator.setBackgroundColor(context.getResources().getColor(R.color.task_priority_low));
                    break;
                case 2:
                    holder.priorityIndicator.setBackgroundColor(context.getResources().getColor(R.color.task_priority_medium));
                    break;
                case 3:
                    holder.priorityIndicator.setBackgroundColor(context.getResources().getColor(R.color.task_priority_high));
                    break;
            }
        } else {
            holder.priorityIndicator.setVisibility(View.GONE);
        }

        // Animate checkbox state change
        holder.checkIndicator.animate()
            .scaleX(currentTask.isCompleted() ? 1.2f : 1.0f)
            .scaleY(currentTask.isCompleted() ? 1.2f : 1.0f)
            .setDuration(200)
            .start();
    }

    @Override
    public int getItemCount() {
        return tasks.size();
    }

    public static class TaskViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView cardView;
        TextView taskTextView;
        ImageView checkIndicator;
        View priorityIndicator;

        public TaskViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.cardView);
            taskTextView = itemView.findViewById(R.id.textViewTask);
            checkIndicator = itemView.findViewById(R.id.checkIndicator);
            priorityIndicator = itemView.findViewById(R.id.priorityIndicator);
        }
    }
}