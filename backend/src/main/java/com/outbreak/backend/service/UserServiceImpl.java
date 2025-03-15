package com.outbreak.backend.service;

import com.outbreak.backend.exceptions.APIException;
import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.Division;
import com.outbreak.backend.model.User;
import com.outbreak.backend.payload.UserDTO;
import com.outbreak.backend.payload.UserResponse;
import com.outbreak.backend.repositories.DivisionRepository;
import com.outbreak.backend.repositories.UserRepository;
import com.outbreak.backend.security.response.MessageResponse;
import com.outbreak.backend.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    UserRepository userRepository;

    @Autowired
    DivisionRepository divisionRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    AuthUtil authUtil;

    @Override
    public UserResponse searchUserByIdOrUserName(String input, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<User> userPage;

        // Check if input is a valid userId (numeric)
        try {
            Long userId = Long.parseLong(input);
            userPage = userRepository.findByUserIdOrUserNameLikeIgnoreCase(userId, "%"+ input + "%", pageDetails);
        } catch (NumberFormatException e) {
            // If not numeric, treat it as a username search
            userPage = userRepository.findByUserNameLikeIgnoreCase("%" + input + "%", pageDetails);
        }

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

    @Override
    public UserDTO deleteUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userID", userId));

        userRepository.delete(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO, Long userId) {
        User savedUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","userId",userId));

        Division division = divisionRepository.findById(userDTO.getDivisionId())
                .orElseThrow(() -> new ResourceNotFoundException("Division","divisionId",userDTO.getDivisionId()));

        User user = modelMapper.map(userDTO,User.class);
        user.setUserId(userId);

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(userDTO.getPassword()));
        } else {
            user.setPassword(savedUser.getPassword());
        }

        user.setDivision(division);
        user.setRoles(savedUser.getRoles());
        savedUser = userRepository.save(user);
        return modelMapper.map(savedUser,UserDTO.class);
    }

    @Override
    public UserDTO getUser() {

        User user = authUtil.loggedInUser();
        return modelMapper.map(user, UserDTO.class);

    }

    @Override
    public UserDTO updateUserProfile(UserDTO userDTO) {
        Long userId = authUtil.loggedInUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","userId",userId));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());

        userRepository.save(user);

        return modelMapper.map(user, UserDTO.class);

    }
}
