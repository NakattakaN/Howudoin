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
    public void create_group(@RequestBody group group1,@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        if(claim == null) {
            System.out.println("Not valid");
            return;
        }
        System.out.println("You are creating a new group");
        List<group> allgroups= group_service.grouplist();
        int id= group1.getGroupid();
        for (int i = 0; i < allgroups.size(); i++) {
            if(id == allgroups.get(i).getGroupid()) {
                System.out.println("This group id already exists");
                return;
            }
        }
        if(id <= 0){
            System.out.println("This group id cant exist");
            return;
        }
        group group2 = new group(group1.getGroupid(),group1.getGroupname());
        group_service.savegroup(group2);
        System.out.println("You have created a new group with the id" + group1.getGroupid());
    }

    @PostMapping("/groups/{id}/add-member")
    public void add_member(@PathVariable int id, @RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo user1 = jwt.claimsToUserinfo(claim);
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
        if(found){
            List<userinfo> elma = user_service.getAlluser();
            boolean found2 = false;
            for (int i = 0; i < elma.size(); i++) {
                if(Objects.equals(elma.get(i).username, user1.getUsername())) {
                    System.out.println("User exists");
                    user1 = elma.get(i);
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
                            return;
                        }
                    }
                    newgroup = group;
                    newgroup.adduser(user1);
                    group_service.deletegroup(group);
                    group_service.savegroup(newgroup);
                }
            }
        }
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

    @PostMapping("/groups/{id}/send")
    public void send(@PathVariable int id,@RequestParam String a,@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
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
            group.addmessage(a);
            group_service.savegroup(group);
        }
    }

    @GetMapping("/groups/{id}/messages")
    public List<String> seememessages(@PathVariable int id,@RequestHeader String sendertoken) {
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
            List<String> kedi = new ArrayList<>(List.of());
            for (int i = 0; i < group.getMessages().size(); i++) {
                String elma = group.getMessages().get(i).getMessage();
                kedi.add(elma);
            }
            return kedi;
        }
        return List.of();
    }

}
