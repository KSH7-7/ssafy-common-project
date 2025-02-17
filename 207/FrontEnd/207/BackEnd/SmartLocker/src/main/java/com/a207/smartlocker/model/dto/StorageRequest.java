package com.a207.smartlocker.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StorageRequest {
    private Long lockerId;
    private String phoneNumber;
}
