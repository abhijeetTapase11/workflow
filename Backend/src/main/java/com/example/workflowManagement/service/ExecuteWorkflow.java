package com.example.workflowManagement.service;

import com.example.workflowManagement.entity.Task;
import com.example.workflowManagement.entity.User;
import com.example.workflowManagement.entity.Workflow;
import com.example.workflowManagement.repository.TaskRepo;
import com.example.workflowManagement.repository.WorkflowRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

// workflow execution
@Component
public class ExecuteWorkflow {

    @Autowired
    private TaskRepo taskRepo;
    @Autowired
    private WorkflowRepo workflowRepo;

    // execute function to execute task one by one
    public void execute(ObjectId workflowId, User user) {
        Optional<Workflow> workflow = workflowRepo.findById(workflowId);
        if(workflow.isPresent()){
            Workflow flow = workflow.get();
            List<Task> tasklist= flow.getTasks();
            for (Task task : tasklist) {
                if ("DOB check".equals(task.getApi_check())) {
                    performDobCheck(task, user);
                } else if ("Gender check".equals(task.getApi_check())) {
                    performGenderCheck(task, user);
                } else if ("Pincode check".equals(task.getApi_check())) {
                    performPincodeCheck(task, user);
                }
            }
        }
        else{
            System.out.println("No task found");
        }

    }

    // DOB check task
    private void performDobCheck(Task task, User user) {
        try{
            LocalDate current = LocalDate.now();
            int age = Period.between(user.getDob(), current).getYears();
            int conditionAge = Integer.parseInt(task.getCondition());

            if (age > conditionAge) {
                task.setAction("Gender check");
                task.setStatus("success");
            } else{
                task.setStatus("failure");
                task.setAction("Loan approved");
            }
            taskRepo.save(task);
        }catch (Exception e) {  // Catch generic exceptions or a more specific one like NumberFormatException

            System.out.println("Internal server error");  // Optional: Log the exception for debugging purposes
        }
    }

//    Gender check task
    private void performGenderCheck(Task task, User user) {
        try{

            if ((user.getGender().equalsIgnoreCase("M") && user.getGender().equalsIgnoreCase(task.getCondition())) ||
                    (user.getGender().equalsIgnoreCase("F") && user.getGender().equalsIgnoreCase(task.getCondition()))
            ) {
                task.setAction("Pincode check");
                task.setStatus("success");
            } else{
                task.setAction("Loan status approved");
                task.setStatus("failure");
            }
            taskRepo.save(task);
        }catch(Exception e){
            System.out.println("Internal server error");
        }
    }

//    Pincode check task
    private void performPincodeCheck(Task task, User user) {
        try{

            if (user.getPincode().startsWith(task.getCondition())) {
                task.setAction("loan_approval_required");
                task.setStatus("failure");
            } else {

                task.setAction("loan_approved");
                task.setStatus("success");
            }
            taskRepo.save(task);
        }catch(Exception e){
            System.out.println("Internal server error");
        }
    }
}

//Service --------> Repository
