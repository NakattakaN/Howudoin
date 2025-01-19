package com.prog.hud.Services;
import com.prog.hud.Types.userinfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.prog.hud.Repo.userinfo_repo;
import java.util.List;


@Service
public class UserService {
    @Autowired
    private userinfo_repo userrepo;


    public UserService(){}

    public void saveuser(userinfo user) {
        this.userrepo.save(user);
        System.out.println("Saved this to database:" + user);
    }
    public List<userinfo> getAlluser() {
        return userrepo.findAll();
    }

    public void deleteuser(userinfo user) {
        this.userrepo.delete(user);
        System.out.println("Deleted from database:" + user);
    }

    public void updateuser(userinfo user) {
        this.userrepo.save(user);
        System.out.println("Updated the database:" + user);
    }
}
