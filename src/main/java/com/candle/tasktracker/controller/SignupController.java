package com.candle.tasktracker.controller;

import com.candle.tasktracker.Service.UserService;
import com.candle.tasktracker.dto.UserRegistrationDto;
import com.candle.tasktracker.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class SignupController {

    private final UserService userService;

    public SignupController(UserService userService) {
        this.userService = userService;
    }

//    @GetMapping("/signup")
//    public String signup() {
//        return "signup";
//    }

    @GetMapping("/signup")
    public String signup(Model model) {
        model.addAttribute("userDto", new UserRegistrationDto());
        return "signup";
    }

    @PostMapping("/signup")
    public String processSignup(@ModelAttribute("userDto") UserRegistrationDto dto,
                                RedirectAttributes redirectAttributes) {
        try {
            userService.registerNewUser(dto);
            redirectAttributes.addFlashAttribute("success", true);
            return "redirect:/login";
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
            return "redirect:/signup";
        }
    }
}
