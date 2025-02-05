package com.a207.smartlocker.model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RetrieveResponse {
    private Long lockerId;
    private String message;
}
