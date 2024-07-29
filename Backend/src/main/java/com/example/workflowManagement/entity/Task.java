package com.example.workflowManagement.entity;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection="task")
public class Task {

    @Id
    private ObjectId id;
    private String api_check;
    private String condition;
    private String action;
    private String status;

    public Task() {
    }

    public Task(ObjectId id, String api_check, String condition, String action, String status) {
        this.id = id;
        this.api_check = api_check;
        this.condition = condition;
        this.action = action;
        this.status = status;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getApi_check() {
        return api_check;
    }

    public void setApi_check(String api_check) {
        this.api_check = api_check;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

