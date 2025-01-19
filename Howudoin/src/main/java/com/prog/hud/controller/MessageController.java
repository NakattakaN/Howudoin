package com.prog.hud.controller;
import com.prog.hud.Services.messageService;
import com.prog.hud.Types.message;
import com.prog.hud.Types.userinfo;
import com.prog.hud.utilities.jwt;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
public class MessageController {

    @Autowired
    private UserController userController;

    @Autowired
    private messageService messageService;

    @PostMapping("/message/send")
    public int sendmessage(@RequestHeader String sendertoken,@RequestParam String reciver, @RequestParam String message) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo sender = jwt.claimsToUserinfo(claim);
        userinfo reveiver = userController.userfinderbyusername(reciver);

        boolean elma = false;

        for(int i=0 ; i<reveiver.friends.size();i++){
            if (Objects.equals(reveiver.friends.get(i), sender.getUsername())) {
                elma = true;
                break;
            }
        }
        if(reveiver != null && elma) {
            String id = sender.username + reciver;
            message Message = new message(sender,reveiver,message,id);
            messageService.savemessage(Message);
        }
        else{
            System.out.println(sender.getUsername() + " not found");
        }
        return 1;
    }

    @GetMapping("/message")
    public List<String> messagelog(@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo user = jwt.claimsToUserinfo(claim);
        userController.signin(user);
        List<message> messages;
        List<String> actualmessages = new ArrayList<>();
        messages= messageService.getAllmessage();
        for(int i=0 ; i<messages.size();i++){
            if(Objects.equals(messages.get(i).getSender().getUsername(), user.getUsername()) || Objects.equals(messages.get(i).getReceiver().getUsername(), user.getUsername())) {
                actualmessages.add(messages.get(i).message);
            }
        }
        return actualmessages;
    }
}
