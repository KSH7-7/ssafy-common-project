package com.a207.smartlocker.model.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StorageResponse {
    private Long lockerId;
    private Long tokenValue;
    private String message;
}
