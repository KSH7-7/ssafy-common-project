package com.a207.smartlocker.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RetrieveRequest {
    private Long lockerId;
    private Long tokenValue;
}