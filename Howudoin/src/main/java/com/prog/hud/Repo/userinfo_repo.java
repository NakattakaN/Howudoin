package com.prog.hud.Repo;
import com.prog.hud.Types.userinfo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface userinfo_repo extends MongoRepository<userinfo, String> {
   // public userinfo findByFirstName(String firstName);
}
