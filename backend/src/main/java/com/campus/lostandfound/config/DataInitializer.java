package com.campus.lostandfound.config;

import com.campus.lostandfound.entity.Category;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.Role;
import com.campus.lostandfound.repository.CategoryRepository;
import com.campus.lostandfound.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@campus.edu")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@campus.edu")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
        }

        List<String> categories = Arrays.asList(
                "Electronics", "Documents", "Clothing", "Accessories", "Keys", 
                "Books", "Bags", "Sports Equipment", "Stationery", "Other"
        );

        for (String catName : categories) {
            if (!categoryRepository.existsByNameIgnoreCase(catName)) {
                Category category = Category.builder()
                        .name(catName)
                        .description("Category for " + catName)
                        .build();
                categoryRepository.save(category);
            }
        }
    }
}
