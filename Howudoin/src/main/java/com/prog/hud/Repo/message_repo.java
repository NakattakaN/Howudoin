package com.prog.hud.Repo;
import com.prog.hud.Types.message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface message_repo extends MongoRepository<message,String> {
}
