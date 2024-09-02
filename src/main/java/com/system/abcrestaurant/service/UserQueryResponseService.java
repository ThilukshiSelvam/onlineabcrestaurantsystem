package com.system.abcrestaurant.service;

import com.system.abcrestaurant.dto.UserQueryResponseDTO;
import com.system.abcrestaurant.request.SubmitUserQueryResponseRequest;

public interface UserQueryResponseService {

    UserQueryResponseDTO submitUserQueryResponse(SubmitUserQueryResponseRequest request);
}