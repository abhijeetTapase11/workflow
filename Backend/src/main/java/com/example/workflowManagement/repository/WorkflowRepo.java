package com.example.workflowManagement.repository;

import com.example.workflowManagement.entity.Workflow;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WorkflowRepo extends MongoRepository<Workflow, ObjectId> {
}
