package com.outbreak.backend.security;

import com.outbreak.backend.model.*;
import com.outbreak.backend.repositories.DistrictRepository;
import com.outbreak.backend.repositories.DivisionRepository;
import com.outbreak.backend.repositories.RoleRepository;
import com.outbreak.backend.repositories.UserRepository;
import com.outbreak.backend.security.jwt.AuthEntryPointJwt;
import com.outbreak.backend.security.jwt.AuthTokenFilter;
import com.outbreak.backend.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Set;

@Configuration
@EnableWebSecurity
//@EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/v3/api-docs/**").permitAll()
                                .requestMatchers("/h2-console/**").permitAll()
                                //.requestMatchers("/api/admin/**").permitAll()
                                //.requestMatchers("/api/public/**").permitAll()
                                .requestMatchers("/swagger-ui/**").permitAll()
                                .requestMatchers("/api/test/**").permitAll()
                                .requestMatchers("/images/**").permitAll()
                                .requestMatchers("/api/public/alerts").permitAll()
                                .requestMatchers("/api/public/caseData/get").permitAll()
                                .requestMatchers("/api/public/division").permitAll()
                                .requestMatchers("/api/public/users/profile").permitAll()
                                .requestMatchers("/api/public/article").permitAll()
                                .requestMatchers("/api/public/graph/monthly").permitAll()
                                .requestMatchers("/api/public/graph/district").permitAll()
                                .requestMatchers("/api/public/graph/week").permitAll()
                                .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        http.headers(headers -> headers.frameOptions(
                frameOptions -> frameOptions.sameOrigin()
        ));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Allow frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed methods
        configuration.setAllowedHeaders(Arrays.asList("*")); // Allow all headers
        configuration.setAllowCredentials(true); // Allow cookies/session

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration); // Apply to all routes under /api
        return source;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web -> web.ignoring().requestMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**"));
    }

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, DivisionRepository divisionRepository, DistrictRepository districtRepository) {
        return args -> {
            // Retrieve or create roles
            Role publicUserRole = roleRepository.findByRoleName(AppRole.ROLE_PUBLIC_USER)
                    .orElseGet(() -> {
                        Role newPublicUserRole = new Role(AppRole.ROLE_PUBLIC_USER);
                        return roleRepository.save(newPublicUserRole);
                    });


            Role mohUserRole = roleRepository.findByRoleName(AppRole.ROLE_MOH_USER)
                    .orElseGet(() -> {
                        Role newMohRole = new Role(AppRole.ROLE_MOH_USER);
                        return roleRepository.save(newMohRole);
                    });

            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> {
                        Role newAdminRole = new Role(AppRole.ROLE_ADMIN);
                        return roleRepository.save(newAdminRole);
                    });

            Set<Role> publicUserRoles = Set.of(publicUserRole);
            Set<Role> mohUserRoles = Set.of(publicUserRole,mohUserRole);
            Set<Role> adminRoles = Set.of(publicUserRole, mohUserRole, adminRole);

            // Create Division and District for testing
            if(!districtRepository.existsByDistrictName("Colombo")){

                District colomboDistrict = new District("Colombo");

                districtRepository.save(colomboDistrict);

            }

            if(!divisionRepository.existsByDivisionName("Nugegoda")){

                Division nugegodaDivision = new Division("Nugegoda");
                District dst1 = districtRepository.findByDistrictName("Colombo");
                nugegodaDivision.setDistrict(dst1);

                divisionRepository.save(nugegodaDivision);

            }

            Division cmbDivision = divisionRepository.findByDivisionName("Nugegoda");
//            System.out.println("division_id : " + cmbDivision.getDivisionId() + " " + "Division name :" + cmbDivision.getDivisionName());


            // Create users if not already present
            if (!userRepository.existsByUserName("publicUser1")) {
                User publicUser = new User("publicUser1", "user1@example.com","userfirstname","userlastname",passwordEncoder.encode("password1"),cmbDivision);
                userRepository.save(publicUser);
            }

            if (!userRepository.existsByUserName("mohUser1")) {
                User mohUser = new User("mohUser1", "mohUser1@example.com","userfirstname","userlastname",passwordEncoder.encode("password2"),cmbDivision);
                userRepository.save(mohUser);
            }

            if (!userRepository.existsByUserName("admin")) {
                User admin = new User("admin", "admin@example.com","userfirstname","userlastname",passwordEncoder.encode("adminPass"),cmbDivision);
                userRepository.save(admin);
            }

            // Update roles for existing users
            userRepository.findByUserName("publicUser1").ifPresent(user -> {
                user.setRoles(publicUserRoles);
                userRepository.save(user);
            });

            userRepository.findByUserName("mohUser1").ifPresent(moh -> {
                moh.setRoles(mohUserRoles);
                userRepository.save(moh);
            });

            userRepository.findByUserName("admin").ifPresent(admin -> {
                admin.setRoles(adminRoles);
                userRepository.save(admin);
            });
        };
    }
}