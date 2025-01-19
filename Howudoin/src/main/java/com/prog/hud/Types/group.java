package com.prog.hud.Types;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
@Document(collection = "Groups")
public class group {
    @Id
    private int groupid;
    private String groupname;
    private String groupdesc;
    private List<userinfo> users;
    private List<message> messages;

    public group() {}

    public group(int groupid, String groupname) {
        LocalDateTime samet = LocalDateTime.now();
        this.groupid = groupid;
        this.groupname = groupname;
        this.groupdesc = samet.toString();
        users = new ArrayList<userinfo>();
        messages = new ArrayList<message>();
    }
    public void addmessage(String messa,userinfo sender) {
        message mesage1 = new message(messa,sender.username);
        mesage1.setSender(sender);
        mesage1.sender.setPassword("");
        mesage1.receiver.setPassword("");
        this.messages.add(mesage1);
    }
    public void adduser(userinfo user) {
        if (user != null) {
            users.add(user);
        }
    }

    public int getGroupid() {
        return groupid;
    }

    public void setGroupid(int groupid) {
        this.groupid = groupid;
    }

    public String getGroupname() {
        return groupname;
    }

    public List<message> getMessages() {
        return messages;
    }

    public void setMessages(List<message> messages) {
        this.messages = messages;
    }

    public void setGroupname(String groupname) {
        this.groupname = groupname;
    }

    public String getGroupdesc() {
        return groupdesc;
    }

    public void setGroupdesc(String groupdesc) {
        this.groupdesc = groupdesc;
    }

    public List<userinfo> getUsers() {
        return users;
    }

    public void setUsers(List<userinfo> users) {
        this.users = users;
    }
}
