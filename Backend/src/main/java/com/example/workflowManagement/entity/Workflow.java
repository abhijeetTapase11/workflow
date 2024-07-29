package com.example.workflowManagement.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "workflow")
public class Workflow {

    @Id
    private ObjectId id;
    private String name;
    @DBRef
    private List<Task> tasks = new ArrayList<>();

    public Workflow() {
        // Ensure the list is initialized
        this.tasks = new ArrayList<>();
    }

    public Workflow(ObjectId id, String name, List<Task> tasks) {
        this.id = id;
        this.name = name;
        this.tasks = tasks != null ? tasks : new ArrayList<>();  // Ensure the list is initialized
    }

    // Getters and setters
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}

