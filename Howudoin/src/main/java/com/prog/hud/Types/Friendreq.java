package com.prog.hud.Types;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Friends")
public class Friendreq {
    private userinfo sending_user;
    @Id
    private userinfo receiving_user;
    private boolean request_status;
    public String message;


    public Friendreq(userinfo sending_user) {
        this.sending_user = sending_user;
        this.request_status = false;
        this.message = "";
    }

    @Override
    public String toString() {
        return "Friendreq{" +
                "sending_user=" + sending_user +
                ", receiving_user=" + receiving_user +
                ", request_status=" + request_status +
                ", message='" + message + '\'' +
                '}';
    }

    public userinfo getSending_user() {
        return sending_user;
    }

    public void setSending_user(userinfo sending_user) {
        this.sending_user = sending_user;
    }

    public userinfo getReceiving_user() {
        return receiving_user;
    }

    public void setReceiving_user(userinfo receiving_user) {
        this.receiving_user = receiving_user;
    }

    public boolean isRequest_status() {
        return request_status;
    }

    public void setRequest_status(boolean request_status) {
        this.request_status = request_status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
