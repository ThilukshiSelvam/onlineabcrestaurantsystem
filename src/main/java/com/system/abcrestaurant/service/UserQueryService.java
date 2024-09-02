package com.system.abcrestaurant.service;

import com.system.abcrestaurant.model.UserQuery;
import com.system.abcrestaurant.request.SubmitUserQueryRequest;

public interface UserQueryService {

    UserQuery submitUserQuery(SubmitUserQueryRequest request);
}