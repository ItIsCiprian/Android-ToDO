package com.todoapp;

import org.json.JSONException;
import org.json.JSONObject;

public class TaskItem {
    private String taskName;
    private boolean isCompleted;

    public TaskItem(String taskName, boolean isCompleted) {
        this.taskName = taskName;
        this.isCompleted = isCompleted;
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

    public String serialize() {
        try {
            JSONObject json = new JSONObject();
            json.put("taskName", taskName);
            json.put("isCompleted", isCompleted);
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
            return new TaskItem(taskName, isCompleted);
        } catch (JSONException e) {
            return null;
        }
    }
}