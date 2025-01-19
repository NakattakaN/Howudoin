package com.prog.hud.controller;
import com.prog.hud.Services.UserService;
import com.prog.hud.Services.messageService;
import com.prog.hud.Types.group;
import com.prog.hud.Services.group_service;
import com.prog.hud.Types.userinfo;
import com.prog.hud.Types.message;
import com.prog.hud.utilities.jwt;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@RestController
public class group_controller {

    @Autowired
    group_service group_service;

    @Autowired
    UserService user_service;

    @PostMapping("/groups/create")
    public ResponseEntity<String> create_group(@RequestBody group group1,@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo user1 = jwt.claimsToUserinfo(claim);

        if(claim == null) {
            System.out.println("Not valid");
            return null;
        }
        System.out.println("You are creating a new group");
        List<group> allgroups= group_service.grouplist();
        int id= group1.getGroupid();
        for (int i = 0; i < allgroups.size(); i++) {
            if(id == allgroups.get(i).getGroupid()) {
                System.out.println("This group id already exists");
                return ResponseEntity.badRequest().body("A group with this id already exists");
            }
        }
        if(id <= 0){
            System.out.println("This group id cant exist");
            return ResponseEntity.badRequest().body("Group id cant exists");
        }
        group group2 = new group(group1.getGroupid(),group1.getGroupname());
        group2.adduser(user1);
        group_service.savegroup(group2);
        System.out.println("You have created a new group with the id" + group1.getGroupid());
        return ResponseEntity.ok().body("Group has been created");
    }

    @PostMapping("/groups/{id}/add-member")
    public ResponseEntity<String> add_member(@PathVariable int id, @RequestHeader String sendertoken, @RequestParam String username) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        List<userinfo> armut = this.user_service.getAlluser();
        userinfo user1 = null;
        List<group> allgroups= group_service.grouplist();
        boolean found = false;
        group group = new group();
        for (int i = 0; i < allgroups.size(); i++) {
            if(id == allgroups.get(i).getGroupid()) {
                System.out.println("Group exists");
                group = allgroups.get(i);
                found = true;
            }
        }
        boolean flag = false;
        if(found) {
            List<userinfo> elma = user_service.getAlluser();
            boolean found2 = false;
            for (int i = 0; i < armut.size(); i++) {
                if (armut.get(i).getUsername().equals(username)) {
                    System.out.println("User found");
                    user1 = armut.get(i);
                    found2 = true;
                }
            }
            if(found2) {
                group newgroup;
                if (group.getUsers() != null) {
                    List<userinfo> existing_users = group.getUsers();
                    for (int i = 0; i < existing_users.size(); i++) {
                        if (Objects.equals(existing_users.get(i).getUsername(), user1.getUsername())) {
                            System.out.println("User already exists in group");
                            return ResponseEntity.badRequest().body("User already exists in group");
                        }
                    }
                    newgroup = group;
                    newgroup.adduser(user1);
                    group_service.deletegroup(group);
                    group_service.savegroup(newgroup);
                }
            }
            else{
                return ResponseEntity.badRequest().body("User doesnt exist");
            }
        }
        return ResponseEntity.ok().body("User added");
    }
    @GetMapping("/groups/{id}/members")
    public List<String> seemembers(@PathVariable int id,@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        if(claim == null) {
            System.out.println("Not valid");
            return null;
        }
        List<group> allgroups= group_service.grouplist();
        group group = new group();
        boolean found = false;
        for (int i = 0; i < allgroups.size(); i++) {
            if(id == allgroups.get(i).getGroupid()) {
                System.out.println("Group exists");
                group = allgroups.get(i);
                found = true;
            }
        }
        if(found){
            List<String> usernamessss = new ArrayList<>(List.of());
            for(int i=0; i<group.getUsers().size(); i++){
                usernamessss.add(group.getUsers().get(i).username);
            }
            return usernamessss;
        }
        return List.of();
    }

    @GetMapping("/groups/getusersgroups")
    public ArrayList<group> getusersgroups(@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        if(claim == null) {
            System.out.println("Not valid");
            return null;
        }
        userinfo user1 = jwt.claimsToUserinfo(claim);
        List<group> allgroups= this.group_service.grouplist();
        ArrayList<group> usersgroups = new ArrayList<>();
        for (int i = 0; i < allgroups.size(); i++) {
            for(int j =0 ; j< allgroups.get(i).getUsers().size();j++){
                if (Objects.equals(allgroups.get(i).getUsers().get(j).getUsername(), user1.getUsername())) {
                    usersgroups.add(allgroups.get(i));
                }
            }
        }
        return usersgroups;
    }

    @PostMapping("/groups/{id}/send")
    public void send(@PathVariable int id,@RequestParam String a,@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo user1 = jwt.claimsToUserinfo(claim);
        if(claim == null) {
            System.out.println("Not valid");
            return;
        }
        List<group> allgroups= group_service.grouplist();
        group group = new group();
        boolean found = false;
        for (int i = 0; i < allgroups.size(); i++) {
            if(id == allgroups.get(i).getGroupid()) {
                System.out.println("Group exists");
                group = allgroups.get(i);
                group_service.deletegroup(allgroups.get(i));
                found = true;
            }
        }
        if(found){
            group.addmessage(a,user1);
            group_service.savegroup(group);
        }
    }

    @GetMapping("/groups/{id}/messages")
    public List<message> seememessages(@PathVariable int id,@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        if(claim == null) {
            System.out.println("Not valid");
            return List.of();
        }
        List<group> allgroups= group_service.grouplist();
        group group = new group();
        boolean found = false;
        for (int i = 0; i < allgroups.size(); i++) {
            if(id == allgroups.get(i).getGroupid()) {
                System.out.println("Group exists");
                group = allgroups.get(i);
                found = true;
            }
        }
        if(found){
            List<message> kedi = new ArrayList<>(List.of());
            for (int i = 0; i < group.getMessages().size(); i++) {
                message elma = group.getMessages().get(i);
                kedi.add(elma);
            }
            return kedi;
        }
        return List.of();
    }

}
