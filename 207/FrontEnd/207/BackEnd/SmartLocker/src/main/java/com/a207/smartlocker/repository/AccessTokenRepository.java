package com.a207.smartlocker.repository;

import com.a207.smartlocker.model.entity.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {

}
