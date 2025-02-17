package com.a207.smartlocker.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 통합 테이블 방식
@Entity
@Table(name = "locker_queue")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LockerQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "queue_id")
    private Long queueId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locker_id")
    private Locker lockerId;

    @Column(name = "request_type")
    private String requestType;
}