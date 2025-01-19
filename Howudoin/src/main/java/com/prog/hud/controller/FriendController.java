package com.prog.hud.controller;
import com.prog.hud.Services.Friendservice;
import com.prog.hud.Services.UserService;
import com.prog.hud.Types.Friendreq;
import com.prog.hud.Types.userinfo;
import com.prog.hud.utilities.jwt;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;




@RestController
public class FriendController {
    @Autowired
    UserController userController;

    @Autowired
    Friendservice friendservice;

    @Autowired
    UserService userservice;


    @PostMapping("/friend/send")
    public boolean requestsender(@RequestHeader String sendertoken,@RequestParam String reciver,@RequestParam String message) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo sender = jwt.claimsToUserinfo(claim);
        if(sender == null) {return false;}
        String username = sender.getUsername();
        Friendreq friendreq = new Friendreq(sender);
        userinfo reviver = userController.userfinderbyusername(reciver);
        if(reviver != null) {
            System.out.println("You are sending a friend request");
            friendreq.setReceiving_user(reviver);

            friendreq.setMessage(message);
            friendservice.savereq(friendreq);
            System.out.println("Request sent succefully yeeeey     " + reviver.getUsername());
            sender.friendreqlist.add(friendreq);

        }
        return true;
    }
    @PostMapping("/friend/accept")
    public boolean acceptfriendreq(@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo reciver = jwt.claimsToUserinfo(claim);
        Friendreq friendreq = doesreq_exist(reciver.username);
        if(friendreq != null && !friendreq.isRequest_status()) {
            userinfo sender = friendreq.getSending_user();
            sender = this.userController.userfinderbyusername(sender.getUsername());
            reciver = this.userController.userfinderbyusername(reciver.getUsername());
            ArrayList<String> reci = reciver.getFriends();
            ArrayList<String> sent = sender.getFriends();
            this.userservice.deleteuser(reciver);
            this.userservice.deleteuser(sender);
            this.friendservice.deletereq(friendreq);

            System.out.println("You accepted your friend request!!!!");
            System.out.println("This is the message your friend sended you");
            String message = friendreq.getMessage();
            System.out.println(message);
            friendreq.setRequest_status(true);

            reci.add(sender.getUsername());
            sent.add(reciver.getUsername());

            reciver.setFriends(reci);
            sender.setFriends(sent);


            //problem çözüldü , struct olarak ekleyince hata veriyordu userları o yüzden friends kısmına sadece usernameleri ekliyoz
            // öbür türlü structtaki userinfolar sonsuz döngüye giriyordu
            this.userservice.updateuser(reciver);
            this.userservice.updateuser(sender);
            this.friendservice.updatereq(friendreq);
            System.out.println("Friends added to database");

        }
        else {
            System.out.println("No request sended for this user ):");
            return false;
        }
        return true;
    }

    @GetMapping("/friendreqlist")
    public List<Friendreq> isitreal(@RequestHeader String sendertoken) {
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo reciver = jwt.claimsToUserinfo(claim);
        List<Friendreq> friend_istek_list = this.friendservice.frienreqlist();
        List<Friendreq> friend_list = new ArrayList<>();
        for(int i=0; i<friend_istek_list.size(); i++) {
            if(Objects.equals(friend_istek_list.get(i).getReceiving_user().getUsername(), reciver.getUsername()) && !friend_istek_list.get(i).isRequest_status()) {
                friend_list.add(friend_istek_list.get(i));
                friend_istek_list.remove(i);
            }
        }
        return friend_list;
    }


    public Friendreq doesreq_exist(String Username) {
        List<Friendreq> friend_istek_list = friendservice.frienreqlist();
        for(int i=0; i<friend_istek_list.size(); i++) {
            if(Objects.equals(friend_istek_list.get(i).getReceiving_user().username, Username)) {
                return friend_istek_list.get(i);
            }
        }
        return null;
    }
    @GetMapping("/friend")
    public ArrayList<String> friendlist(@RequestHeader String sendertoken) {
        UserService userService = new UserService();
        jwt token = new jwt();
        Claims claim = jwt.validateToken(sendertoken);
        userinfo sender = jwt.claimsToUserinfo(claim);
        List<userinfo> elma = userservice.getAlluser();
        for (int i = 0; i < elma.size(); i++) {
            if (elma.get(i).getUsername().equals(sender.getUsername())) {
                System.out.println("User found");
                sender = elma.get(i);
            }
        }
        if(sender != null) {
            System.out.println(sender.getUsername());
            return sender.getFriends();
        }
        return null;
    }
}
