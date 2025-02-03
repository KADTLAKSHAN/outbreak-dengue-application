package com.outbreak.backend.service;

import com.outbreak.backend.payload.UserDTO;
import com.outbreak.backend.payload.UserResponse;

public interface UserService {
    UserResponse searchUserByIdOrUserName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserDTO deleteUserById(Long userId);

    UserDTO updateUser(UserDTO userDTO, Long userId);
}
