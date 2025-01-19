package com.prog.hud.Services;
import com.prog.hud.Repo.message_repo;
import org.springframework.beans.factory.annotation.Autowired;
import com.prog.hud.Types.message;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class messageService {

    @Autowired
    private message_repo message_Repo;

    public messageService() {}

    public void savemessage(message message) {
        this.message_Repo.save(message);
        System.out.println("Saved this to database:" + message);
    }
    public List<message> getAllmessage() {
        return message_Repo.findAll();
    }

    public void deletemessage(message message) {
        this.message_Repo.delete(message);
        System.out.println("Deleted from database:" + message);
    }

    public void updatemessage(message message) {
        this.message_Repo.save(message);
        System.out.println("Updated the database:" + message);
    }
}
