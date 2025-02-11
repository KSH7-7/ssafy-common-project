package com.a207.smartlocker.service;


import com.a207.smartlocker.model.dto.*;

import com.a207.smartlocker.model.entity.Locker;

import java.util.List;


public interface LockerService {
    RetrieveResponse retrieveItem(RetrieveRequest request) throws Exception;
    StorageResponse storeItem(StorageRequest request);
    List<Locker> getLockersByLocation(String locationName);
    List<TaskQueueResponse> getRetrieveTasks();
}
