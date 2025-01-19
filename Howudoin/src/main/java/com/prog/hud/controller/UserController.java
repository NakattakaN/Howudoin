package com.prog.hud.controller;

import com.prog.hud.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.prog.hud.Types.userinfo;
import com.prog.hud.utilities.jwt;
import java.util.List;




@RestController
public class UserController {

    @Autowired
    private UserService userservice;

    public UserController(){}

    @PostMapping("/register")
    public String signup(@RequestBody userinfo user) {
//signup için useri body olarak alıyor
        String password = user.getPassword();
        String rePassword = user.getPassword();
        String username = user.getUsername();
        String name = user.name;
        String surname = user.surname;
        if(userfinderbyusername(username) != null && username.equals(userfinderbyusername(username).username)){
            System.out.println("This email is already in use. Please choose another one.");
            return "no";
        }
        boolean pass_check = false;

        if(password.equals(rePassword)) {
            pass_check = true;
        }
        else{
            System.out.println("Passwords do not match. Please try again.");
        }

        System.out.println(user.username);
        this.userservice.saveuser(user);
        return "It works" + user;
    }

    @PostMapping("/login")
    public String signin(@RequestBody userinfo user) {
        //useri yine body olarak alıyor
        List<userinfo> elma = userservice.getAlluser();
        for (int i = 0; i < elma.size(); i++) {
            if (elma.get(i).getUsername().equals(user.getUsername())) {
                if (elma.get(i).getPassword().equals(user.getPassword())) {
                    //System.out.println("Welcome " + elma.get(i).name + " " + elma.get(i).surname);
                    String token = jwt.generateToken(user);
                    return token;
                }
            }
        }

        System.out.println("User not found");
        System.out.println("Please re-enter your credentials");
        userinfo nouser = new userinfo("no","tp");
        return null;
    }
    public userinfo userfinderbyusername(String username) {
        List<userinfo> elma = userservice.getAlluser();
        for (int i = 0; i < elma.size(); i++) {
            if (elma.get(i).getUsername().equals(username)) {
                System.out.println("User found");
                return elma.get(i);
            }
        }
        System.out.println("User not found");
        return null;
    }
}
