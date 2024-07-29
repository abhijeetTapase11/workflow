package com.example.workflowManagement.service;

import com.example.workflowManagement.entity.User;
import com.example.workflowManagement.repository.UserRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class UserService {

    @Autowired
    private UserRepo userRepo;

//     Add user or create user
    public User addUser(User user){
        return userRepo.save(user);

    }

    // get user by userId
    public User findUser(ObjectId userId){
        if(userRepo.findById(userId).isPresent())
            return userRepo.findById(userId).get();

        return new User();
    }

}


//Service --------> Repository
