package com.example.workflowManagement.repository;

import com.example.workflowManagement.entity.Task;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepo extends MongoRepository<Task, ObjectId> {
}
