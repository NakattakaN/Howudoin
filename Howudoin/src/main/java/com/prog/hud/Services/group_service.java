package com.prog.hud.Services;
import com.prog.hud.Types.group;
import com.prog.hud.Repo.group_repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class group_service {
    
    @Autowired
    private group_repo repo;
    
    public group_service() {}

    public void savegroup(group friendreq) {
        this.repo.save(friendreq);
    }

    public List<group> grouplist() {
        return repo.findAll();
    }

    public void updategroup(group friendreq) {
        this.repo.save(friendreq);
    }

    public void deletegroup(group friendreq) {
        this.repo.delete(friendreq);
    }
    
}
