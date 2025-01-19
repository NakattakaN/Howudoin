package com.prog.hud.Types;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.lang.annotation.Documented;
import java.util.Collection;

@Document(collection = "Messages")
public class message {
    public userinfo sender;
    public userinfo receiver;
    public String message;
    public String status;
    public String messageid;

    public message(userinfo sender, userinfo receiver, String message, String messageid) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.status = "Not read";
        this.messageid = messageid;
    }
    public message() {}

    public message(String message) {
        this.message = message;
        this.sender = null;
        this.receiver = null;
        this.status = "Not read";
        this.messageid = null;
    }

    public userinfo getSender() {
        return sender;
    }

    public void setSender(userinfo sender) {
        this.sender = sender;
    }

    public userinfo getReceiver() {
        return receiver;
    }

    public void setReceiver(userinfo receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessageid() {
        return messageid;
    }

    public void setMessageid(String messageid) {
        this.messageid = messageid;
    }
}
