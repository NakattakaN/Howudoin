package com.prog.hud.Types;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
        this.groupid = groupid;
        this.groupname = groupname;
        this.groupdesc = "";
        users = new ArrayList<userinfo>();
        messages = new ArrayList<message>();
    }
    public void addmessage(String messa) {
        message mesage1 = new message(messa);
        messages.add(mesage1);
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
