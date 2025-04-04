package com.outbreak.backend.controller;

import com.outbreak.backend.config.AppConstants;
import com.outbreak.backend.payload.UserDTO;
import com.outbreak.backend.payload.UserResponse;
import com.outbreak.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;


    @GetMapping("/public/users/username/{input}")
    public ResponseEntity<UserResponse> getUserByUserNameOrId(@PathVariable String input,
                                                          @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                          @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                          @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false) String sortBy,
                                                          @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){

        UserResponse userResponse = userService.searchUserByIdOrUserName(input, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(userResponse, HttpStatus.FOUND);



    }

    @GetMapping("/public/users")
    public ResponseEntity<UserResponse> getAllUsers(@RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                    @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                    @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false) String sortBy,
                                                    @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){


        UserResponse userResponse = userService.getAllUsers(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);


    }

    @DeleteMapping("/admin/users/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable Long userId){

        UserDTO deletedUTO = userService.deleteUserById(userId);
        return new ResponseEntity<>(deletedUTO, HttpStatus.OK);

    }

    @PutMapping("/public/users/{userId}")
    public ResponseEntity<UserDTO> updateUser(@Valid @RequestBody UserDTO userDTO, @PathVariable Long userId){

        UserDTO saveUserDTO = userService.updateUser(userDTO, userId);
        return new ResponseEntity<>(saveUserDTO, HttpStatus.OK);

    }

    @GetMapping("/public/user")
    public ResponseEntity<UserDTO> getUser(){
        UserDTO userDTO = userService.getUser();
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/public/users/profile")
    public ResponseEntity<UserDTO> updateUserProfile(@RequestBody UserDTO userDTO){

        UserDTO saveUserDTO = userService.updateUserProfile(userDTO);
        return new ResponseEntity<>(saveUserDTO, HttpStatus.OK);

    }


}
