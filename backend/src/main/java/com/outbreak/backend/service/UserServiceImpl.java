package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.model.User;
import com.outbreak.backend.payload.UserDTO;
import com.outbreak.backend.payload.UserResponse;
import com.outbreak.backend.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public UserResponse searchUserByUserName(String userName, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<User> userPage = userRepository.findByUserNameLikeIgnoreCase("%"+ userName + "%", pageDetails);

        List<User> users = userPage.getContent();

        if(users.isEmpty())
            throw new APIException("Users/User not found with username");

        List<UserDTO> userDTOS = users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();

        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userDTOS);
        userResponse.setPageNumber(userPage.getNumber());
        userResponse.setPageSize(userPage.getSize());
        userResponse.setTotalElements(userPage.getTotalElements());
        userResponse.setTotalpages(userPage.getTotalPages());
        userResponse.setLastpage(userPage.isLast());
        return userResponse;
    }

    @Override
    public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> userPage = userRepository.findAll(pageDetails);

        List<User> users = userPage.getContent();

        if(users.isEmpty())
            throw new APIException("users not exists");


        List<UserDTO> userDTOS = users.stream()
                .map(user -> modelMapper.map(user,UserDTO.class))
                .toList();

        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userDTOS);
        userResponse.setPageNumber(userPage.getNumber());
        userResponse.setPageSize(userPage.getSize());
        userResponse.setTotalElements(userPage.getTotalElements());
        userResponse.setTotalpages(userPage.getTotalPages());
        userResponse.setLastpage(userPage.isLast());
        return userResponse;

    }
}
