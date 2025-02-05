package com.a207.smartlocker.service;


import com.a207.smartlocker.model.dto.RetrieveRequest;
import com.a207.smartlocker.model.dto.RetrieveResponse;

import com.a207.smartlocker.model.dto.StorageRequest;
import com.a207.smartlocker.model.dto.StorageResponse;
import com.a207.smartlocker.model.entity.Locker;

import java.util.List;


public interface LockerService {
    RetrieveResponse retrieveItem(RetrieveRequest request) throws Exception;
    StorageResponse storeItem(StorageRequest request);
    List<Locker> getLockersByLocation(String locationName);
}
