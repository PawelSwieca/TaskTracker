package com.candle.tasktracker.repository;


import com.candle.tasktracker.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer>{
    Optional<Status> findByName(String statusName);

    @Query("SELECT s FROM Status s WHERE LOWER(s.name) = LOWER(:name)")
    Optional<Status> findByNameIgnoreCase(@Param("name") String name);

}
