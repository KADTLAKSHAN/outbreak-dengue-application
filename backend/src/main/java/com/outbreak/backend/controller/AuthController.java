package com.outbreak.backend.controller;

import com.outbreak.backend.exceptions.ResourceNotFoundException;
import com.outbreak.backend.model.AppRole;
import com.outbreak.backend.model.Division;
import com.outbreak.backend.model.Role;
import com.outbreak.backend.model.User;
import com.outbreak.backend.repositories.DivisionRepository;
import com.outbreak.backend.repositories.RoleRepository;
import com.outbreak.backend.repositories.UserRepository;
import com.outbreak.backend.security.jwt.JwtUtils;
import com.outbreak.backend.security.request.LoginRequest;
import com.outbreak.backend.security.request.SignupRequest;
import com.outbreak.backend.security.response.MessageResponse;
import com.outbreak.backend.security.response.UserInfoResponse;
import com.outbreak.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    DivisionRepository divisionRepository;


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),userDetails.getUsername(), roles, jwtCookie.toString());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,jwtCookie.toString())
                                  .body(response);
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        Division division = divisionRepository.findById(signUpRequest.getDivisionId())
                .orElseThrow(() -> new ResourceNotFoundException("Division", "divisionId", signUpRequest.getDivisionId()));

        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                encoder.encode(signUpRequest.getPassword()),
                division);

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if(strRoles == null){
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_PUBLIC_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }else {
            strRoles.forEach(role -> {

                switch (role){

                    case "admin":
                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;

                    case "mohUser":
                        Role mohUserRole = roleRepository.findByRoleName(AppRole.ROLE_MOH_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(mohUserRole);

                        break;

                    default:
                        Role publicUser = roleRepository.findByRoleName(AppRole.ROLE_PUBLIC_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(publicUser);
                }

            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


    @GetMapping("/username")
    public String currentUserName(Authentication authentication){

        if(authentication != null)
            return  authentication.getName();
        else
            return "";
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),userDetails.getUsername(), roles);

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signOutUser(){
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

}
