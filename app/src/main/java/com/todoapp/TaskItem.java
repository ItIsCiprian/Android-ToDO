package com.todoapp;

import org.json.JSONException;
import org.json.JSONObject;

public class TaskItem {
    private String taskName;
    private boolean isCompleted;
    private int priority; // 0 = none, 1 = low, 2 = medium, 3 = high

    public TaskItem(String taskName, boolean isCompleted) {
        this.taskName = taskName;
        this.isCompleted = isCompleted;
        this.priority = 0; // Default no priority
    }

    public TaskItem(String taskName, boolean isCompleted, int priority) {
        this.taskName = taskName;
        this.isCompleted = isCompleted;
        this.priority = priority;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public void toggleCompleted() {
        isCompleted = !isCompleted;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = Math.max(0, Math.min(3, priority));
    }

    public String serialize() {
        try {
            JSONObject json = new JSONObject();
            json.put("taskName", taskName);
            json.put("isCompleted", isCompleted);
            json.put("priority", priority);
            return json.toString();
        } catch (JSONException e) {
            return null;
        }
    }

    public static TaskItem deserialize(String serialized) {
        try {
            JSONObject json = new JSONObject(serialized);
            String taskName = json.optString("taskName", "");
            boolean isCompleted = json.optBoolean("isCompleted", false);
            int priority = json.optInt("priority", 0);
            return new TaskItem(taskName, isCompleted, priority);
        } catch (JSONException e) {
            return null;
        }
    }
}