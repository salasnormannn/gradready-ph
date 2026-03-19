package com.gradready.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, UpdateProfileRequest req) {
        User user = getByEmail(email);
        if (req.getCourse() != null) user.setCourse(req.getCourse());
        if (req.getSchool() != null) user.setSchool(req.getSchool());
        if (req.getRegion() != null) user.setRegion(req.getRegion());
        if (req.getStatus() != null) user.setStatus(req.getStatus());
        if (req.getGraduationYear() != null)
            user.setGraduationYear(Integer.parseInt(req.getGraduationYear()));
        return userRepository.save(user);
    }
}