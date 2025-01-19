package com.prog.hud.Services;

import com.prog.hud.Repo.Frienreq_repo;
import com.prog.hud.Types.userinfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.prog.hud.Types.Friendreq;
import java.util.List;

@Service
public class Friendservice {

    @Autowired
    private Frienreq_repo frienreqrepo;

    public Friendservice() {}

    public void savereq(Friendreq friendreq) {
        this.frienreqrepo.save(friendreq);
    }
    public List<Friendreq> frienreqlist() {
        return frienreqrepo.findAll();
    }

    public void updatereq(Friendreq friendreq) {
        this.frienreqrepo.save(friendreq);
    }

    public void deletereq(Friendreq friendreq) {
        this.frienreqrepo.delete(friendreq);
    }
}
