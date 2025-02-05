package com.a207.smartlocker.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import jakarta.persistence.*;


@Entity
@Table(name = "lockers")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer"})

public class Locker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lockerId;

    @ManyToOne
    @JoinColumn(name = "locker_status_id")
    private LockerStatus lockerStatus;

    @ManyToOne
    @JoinColumn(name = "locker_location_id")
    private LockerLocation lockerLocation;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = true) // Nullable Foreign Key reference
    private AccessToken tokenId;

    public Long getTokenId() {
        return tokenId != null ? tokenId.getTokenId() : null;
    }

    public void updateLockerStatus(LockerStatus status, AccessToken token) {
        this.lockerStatus = status;
        this.tokenId = token;
    }
}

