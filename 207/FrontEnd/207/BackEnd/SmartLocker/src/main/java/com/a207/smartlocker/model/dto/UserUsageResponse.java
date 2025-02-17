package com.a207.smartlocker.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUsageResponse {
    private Long userId;
    private String phoneNumber;
    private Long usageCount;
}
