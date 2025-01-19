package com.prog.hud.Types;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Users")

public class userinfo {

    @Id
    public String username;
    public String password;
    public Vector<Friendreq> friendreqlist;
    @JsonIgnore
    public ArrayList<String> friends;
    public String name;
    public String surname;

    public userinfo(String username, String password) {
        this.friends = new ArrayList<>();
        this.friendreqlist = new Vector<Friendreq>();

        this.username = username;
        this.password = password;
    }


    public ArrayList<String> getFriends() {
        return friends;
    }

    public void setFriends(ArrayList<String> friends) {
        this.friends = friends;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "userinfo{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", friends=" + friends +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                '}';
    }

}
